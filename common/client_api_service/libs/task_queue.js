/**
 * 任务队列服务模块。提供任务的排队，插队。持续运行的队列服务。
 * @module client_api_service/libs/task_queue
 */
"use strict";

const EventEmitter = require('events');
const Task = require('./task');
var findIndex = require('lodash/findIndex')

/** 
 *  合法的状态列表
 *  @type {array}
 */
const QUEUE_STATES = ['init', 'running', 'pause', 'stopping', 'abort','done', 'error'];

/** 
 *  队列自增长id
 *  @type {number}
 */
var taskId = 0;

function stateChange(name) {
    this.state = name;
    this.emit.apply(this, [name].concat(arrSlice.call(arguments, 1)));
}

/**
 * state属性访问器，确保state只在允许的范围内，且不会被外部修改
 */
function StateAccessor() {
    var state = 'init';
    var isEnd = () => {
        return state == 'done' || state == 'error';
    }
    return {
        get: () => state,
        set: (v) => {
            if (QUEUE_STATES.indexOf(v) == -1) {
                throw new Error(`state value must be one of [${QUEUE_STATES}]`);
            }
            if (isEnd()) return;
            state = v;
        }
    }
}


/**
 * 添加一条任务
 * @param {boolean} jump 是否插队，是则添加到队列头部，否则则添加到尾部。插队不道德，所以默认否。
 * @param {function} fn 任务函数
 * @return {Task} task 任务实例
 */
function addTask(jump, fn) {
    if (!this.canAddTask()) {
        return false;
    }

    var task;
    if (fn instanceof Task || fn instanceof TaskQueue) {
        task = fn;
    } else {
        if (typeof fn == 'function') {
            task = new Task(fn);
        }
    }

    if (!task) {
        throw new Error('task must be function or instanceof Task');
    }

    jump ? this._list.unshift(task) : this._list.push(task);
    return task;
}

/**
 * 添加一条任务，如果队列中包含相同任务的内容，则不会添加
 * @param {boolean} jump 是否插队，是则添加到队列头部，否则则添加到尾部。插队不道德，所以默认否。
 * @param {function} fn 任务函数
 * @return {Task} task 任务实例
 */
function addTaskUniq(jump, fn) {
    if (!this.canAddTask()) {
        return false;
    }

    var index = findIndex(this._list, (task) => task.fn == fn);
    if (index == -1) {
        return addTask(fn, jump);
    } else {
        return this._list[index];
    }
}

/** 任务队列类 */
class TaskQueue extends EventEmitter{
    /**
     * 创建一个任务队列
     * @param {number} concurrency 最大并发任务数
     */
    constructor(concurrency) {
        super();

        var stateAccessor = new StateAccessor();

        /** 
         *  @property {number} id 自增长id，只读
         *  @property {string} state 任务状态
         */
        Object.defineProperties(this, {
            id: {
                enumerable: true,
                configurable: false,
                writable: false,
                value: Date.now() + '_' + (++taskId)
            },
            state: {
                enumerable: true,
                configurable: false,
                get: stateAccessor.get,
                set: stateAccessor.set
            }
        });

        /** 
         *  @property {number} concurrency 最大并发任务数
         */
        this.concurrency = concurrency||5;

        /** 
         *  @property {string} name 任务名称
         */
        this.name = 'taskQueue';

        /** 
         * 队列中的任务列表
         * @property {array}
         * @private
         */
        this._list = [];

        /** 
         * 运行中的任务数量
         * @property {array}
         * @private
         */
        this._runningTaskNum = 0;

        /** 
         * 队列运行的定时检查的timerId
         * @property {number}
         * @private
         */
        this._queueTimer = null;
    }

    /**
     * 启动队列服务，队列中任务都执行完毕后，也会运行，有新任务进入队列时，也会执行。
     */
    start() {
        if (this.isEnd()) return;

        var queue = this;
        if (queue._queueTimer) return;

        queue._queueTimer = setInterval(() => {
            if (queue._runningTaskNum < queue.concurrency) {
                if (queue.state == 'pause') {
                    return;
                }

                queue._nextTask();
            }

            if (queue._runningTaskNum === 0 && queue.state == 'stopping' && queue._list.length == 0) {
                queue.state = 'done';
                this.emit('done');
            }
        }, 25);

        queue.state = 'running';
        this.emit('start');
    }

    /**
     * 停止队列服务, 等待执行队列中的剩余任务再停止，且不在接收新的任务加入队列。
     */
    stop() {
        if (this.isEnd()) return;

        this.state = 'stopping';
    }

    /**
     * 中止队列服务, 会停止队列服务，并立即清空队列中等待执行的任务，正在执行的任务会继续执行完。
     */
    abort() {
        if (this.isEnd()) return;

        clearInterval(this._queueTimer);
        this._queueTimer = null;
        this._list.forEach(task => {
            if (task instanceof TaskQueue) {
                task.abort();
            }
        });
        this._list.length = 0;

        this.state = 'abort';
        this.emit('abort');
    }

    /**
     * 暂停队列服务
     */
    pause() {
        if (this.isEnd()) return;

        this._stateBeforePause = this.state;
        this.state = 'pause';
        this.emit('pause');
    }

    /**
     * 恢复队列服务
     */
    resume() {
        if (this.isEnd()) return;

        if (this.state == 'pause') {
            this.state = this._stateBeforePause;
            this.emit('resume', this._stateBeforePause);
        }
    }

    /**
     * 是否结束
     */
    isEnd() {
        return this.state == 'done' || this.state == 'error';
    }

    /**
     * 判断当前能否往队列中添加任务
     */
    canAddTask() {
        return this.state == 'init' || this.state == 'running';
    }

    /**
     * 往队列尾部添加一条任务
     * @param {function|task} fn 任务函数或任务实例
     * @return {Task} task 任务实例
     */
    push(fn) {
        return addTask.call(this, false, fn);
    }

    /**
     * 往队列头部插入一条任务
     * @param {function|task} fn 任务函数或任务实例
     * @return {Task} task 任务实例
     */
    unshift(fn) {
        return addTask.call(this, true, fn);
    }

    /**
     * 往队列尾部添加一条任务，如果队列中包含相同任务的内容，则不会添加
     * @param {function} fn 任务函数
     * @return {Task} task 任务实例
     */
    pushUniq(fn) {
        return addTaskUniq.call(this, false, fn);
    }

    /**
     * 往队列头部插入一条任务，如果队列中包含相同任务的内容，则不会添加
     * @param {function} fn 任务函数
     * @return {Task} task 任务实例
     */
    unshiftUniq(fn) {
        return addTaskUniq.call(this, true, fn);
    }

    /**
     * 获取队列长度
     */
    getLength() {
        return this._list.length;
    }

    /**
     * 清空队列
     */
    clear() {
        this._list.length = 0;
        this.emit('clear');
    }

    /**
     * 调整队列最大并发任务数
     */
    setConcurrency(concurrency) {
        this.concurrency = concurrency||MAX_CONCURRENT_TASK;
    }

    /**
     * 序列化任务队列
     */
    serialize() {
        return this._list.map(task => task.serialize());
    }

    /**
     * 循环队列中的每一项任务，并都执行一次给定的函数。
     * @param {function} callback 在队列每一项上执行的函数，接收三个参数：
            currentValue 当前项（指遍历时正在被处理那个数组项）的值。
            index 当前项的索引（或下标）。
            array 数组本身。
     */
    forEach(callback) {
        this._list.forEach(callback);
    }

    /**
     * 执行下一个任务, 并从队列中移除该任务
     */
    _nextTask() {
        var queue = this;

        var taskRunner = task => {
            task.on('done', () => {
                queue._runningTaskNum--;
            });

            task.on('error', err => {
                queue._runningTaskNum--;
                queue.emit('taskerror', err);
            });

            queue._runningTaskNum++;
            task.start();
        };

        var nextTask = queue._list.shift();
        if (nextTask) {
            taskRunner(nextTask);
        }
    }
}

/**
 * 从系列化的任务字符串中创建一个队列
 * @param {array} arr 队列字符串。
 * @param {object} context 上下文对象。从任务字符串中接续出的函数名会到context中查找对应的任务函数。
 */
TaskQueue.unserialize = (arr, context) => {
    if (!Array.isArray(arr)) {
        throw new Error('param must be an JSON array string');
    }

    var taskQueue = new TaskQueue();

    arr.forEach(item => {
        var task;
        if (Array.isArray(item)) {
            task = TaskQueue.unserialize(item, context);
        } else {
            task = Task.unserialize(item, context);
        }
        taskQueue.push(task);
    });

    return taskQueue;
}

module.exports = TaskQueue;
