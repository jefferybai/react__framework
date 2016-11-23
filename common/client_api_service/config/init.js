/**
 * 初始化保存用户配置, 只执行一次
 * @module client_api_service/config/load
 */
"use strict";

const fs = require('fs');
const fsExtra = require('fs-extra');
const getConfigPath = require('../libs/get_data_path').getConfigPath;
const defaultConfig = require('./default_config');

function init(username, config) {
    return new Promise((resolve, reject) => {
        var path = getConfigPath(username);
        var isNotExit = false;

        try {
            fs.accessSync(path, fs.R_OK | fs.W_OK);
        } catch(err) {
            isNotExit = true;
        }

        if (isNotExit) {
            fsExtra.outputJson(path, config, function (err) {
                if (err) {
                    console.error(err);
                    return reject({
                        code: 'scp-config-init-1'
                    });
                }

                resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports = init;