/**
 * 读取用户配置
 * @module client_api_service/config/load
 */
"use strict";

const path = require('path');
const fsExtra = require('fs-extra');
const getConfigPath = require('../libs/get_data_path').getConfigPath;
const defaultConfig = require('./default_config');
const cache = require('./cache');

function load(username) {
    return new Promise((resolve, reject) => {
        var path = getConfigPath(username);
        fsExtra.readJson(path, (err, jsonObj) => {
            if (err) {
                console.error(err);
                jsonObj = {};
            }

            Object.assign(cache, defaultConfig, jsonObj);

            resolve(cache);
        });
    });
}

module.exports = load;