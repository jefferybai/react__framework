/**
 * 获取用户配置路径
 * @module client_api_service/libs/get_data_path
 */
"use strict";

const os = require('os');
const path = require('path');
const homedir = os.homedir();

/**
 * 计算用户数据目录
 */
function getDataPath(username) {
    username = username||'default'
    var userDataPath;
    if (typeof nw == 'object') {
        userDataPath = path.join(nw.App.dataPath, 'Account', username);
    } else {
        userDataPath = process.env.APPDATA || (process.platform == 'darwin' ? 
            path.join(homedir, 'Library/Application Support') : path.join(homedir, '/.config'));
        userDataPath = path.join(userDataPath, 'paratera-hpc-scp', 'Account', username);
    }
    return userDataPath;
}

/**
 * 计算用户配置文件路径
 */
function getConfigPath(username) {
    return path.join(getDataPath(username), 'config.json');
}

/**
 * 计算用户任务队列持久化文件路径
 */
function getQueuePath(username) {
    return path.join(getDataPath(username), 'transfer_queue.json');
}

exports.getDataPath = getDataPath;
exports.getConfigPath = getConfigPath;
exports.getQueuePath = getQueuePath;