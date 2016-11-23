/**
 * 上传/下载任务基类
 * @module client_api_service/libs/task
 */
"use strict";

const EventEmitter = require('events');

const arrSlice = Array.prototype.slice;

/** 
 *  任务合法的状态列表
 *  @type {array}
 */
const TASK_STATES = ['init', 'running', 'pause', 'abort', 'done', 'error'];

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
            if (TASK_STATES.indexOf(v) == -1) {
                throw new Error(`state value must be one of [${TASK_STATES}]`);
            }
            if (isEnd()) return;
            state = v;
        }
    }
}


/** 任务类 */
class Task extends EventEmitter{
    constructor() {
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
         *  @property {string} name 任务名称
         */
        this.name = 'task';
    }

    /**
     * 初始化任务信息
     * @param {function} fn 任务函数
     * @param {array} args 任务函数的参数。在任务持久化时，会序列化为字符串。
     *  当需要用到任务持久化时，args中应不包含函数，如果参数为函数，会序列化为null。
     *  如确实需要函数参数，可使用bind语法处理，如：new Task(fn.bind(null, fn1, fn2), args);
     */
    initTask(fn, args) {
        if (typeof fn != 'function') {
            throw new Error('fn must be function');
        }
        if (args != null && !Array.isArray(args)) {
            throw new Error('args must be Array');
        }

        /** 
         *  @property {function} fn 任务函数, 设置后就不可改变
         *  @property {function} args 任务函数参数, 设置后就不可改变
         */
        Object.defineProperties(this, {
            fn: {
                enumerable: true,
                configurable: false,
                writable: false,
                value: fn
            },
            args: {
                enumerable: true,
                configurable: false,
                writable: false,
                value: args||[]
            }
        });
    }

    /**
     * 开始执行任务
     */
    start() {
        if (typeof this.fn != 'function') {
            throw new Error('you must iniTask first');
        }

        if (this.isEnd()) return;

        this.state = 'running';
        this.emit('start');

        var onDone = stateChange.bind(this, 'done');
        var onError = stateChange.bind(this, 'error');

        if (typeof this.fn == 'function'){
            var ret;
            try {
                ret = this.fn.apply(this, this.args);

                if (ret instanceof Promise) {
                    ret
                        .then(response => onDone(response))
                        .catch(error => onError(error))
                } else {
                    onDone(ret)
                }
            } catch (error) {
                onError(error)
            }
        }
    }

    /**
     * 是否结束
     */
    isEnd() {
        return this.state == 'done' || this.state == 'error';
    }

    /**
     * 设置任务名称，任务序列化时会用到
     */
    setName(name) {
        this.name = name;
    }

    /**
     * 序列化任务实例为一个普通js对象;
     */
    serialize() {
        var args = (this.args||[]).map(arg => {
            if (typeof arg == 'function') {
                console.warn('task contain function argument, and the argument well serialized as null');
                return null;
            } else {
                return arg;
            }
        });
        return {
            name: this.name,
            args: args
        };
    }
}

/**
 * 从序列化的任务对象中创建一个任务
 * @param {object} obj 序列化后的任务对象。
 * @param {object} context 上下文对象。从任务字符串中接续出的函数名会到context中查找对应的任务函数。
 */
Task.unserialize = (obj, context) => {
    var task = new Task();
    task.initTask(context[obj.name], obj.args);
    task.setName(obj.name);
    return task;
}

module.exports = Task;