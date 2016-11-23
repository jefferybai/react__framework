/**
 * 重置用户配置为默认值
 * @module client_api_service/config/reset
 */
"use strict";

const path = require('path');
const fsExtra = require('fs-extra');
const getConfigPath = require('../libs/get_data_path').getConfigPath;
const defaultConfig = require('./default_config');
const cache = require('./cache');

function reset(username) {
    return new Promise((resolve, reject) => {
        var path = getConfigPath(username);

        fsExtra.outputJson(path, {}, function (err) {
            if (err) {
                console.error(err);
                return reject({
                    code: 'scp-config-rest-1'
                });
            }

            Object.assign(cache, defaultConfig);

            resolve(cache);
        });
    });
}

module.exports = reset;