/**
 * 保存用户配置
 * @module client_api_service/config/save
 */
"use strict";

const fsExtra = require('fs-extra');
const getConfigPath = require('../libs/get_data_path').getConfigPath;
const defaultConfig = require('./default_config');
const cache = require('./cache');

function save(username, config) {
    return new Promise((resolve, reject) => {
        var path = getConfigPath(username);
        fsExtra.readJson(path, (err, jsonObj) => {
            if (err) {
                console.error(err);
                jsonObj = {}
            }

            config = Object.assign({}, jsonObj, config);

            fsExtra.outputJson(path, config, function (err) {
                if (err) {
                    console.error(err);
                    return reject({
                        code: 'scp-config-save-1'
                    });
                }

                console.log(`config save in path ${path}`);

                Object.assign(cache, defaultConfig, config);

                resolve(cache);
            });
        });
    });
}

module.exports = save;