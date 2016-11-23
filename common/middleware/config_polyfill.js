/**
 * web版本下config接口的polyfill
 */
"use strict";

import { CALL_API_LOCAL, CALL_API_LOCAL_START, CALL_API_LOCAL_FAIL } from '../constants/api_local';
import defaultConfig from '../client_api_service/config/default_config';

var configCache = {};

export default store => next => action => {
    if (action.type !== CALL_API_LOCAL) {
        return next(action);
    }

    let {
        apiActionType,
        endpoint,
        data
    } = action;

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }
    if (!['object', 'undefined', 'string'].includes(typeof data)) {
        throw new Error('Expected data to be object');
    }

    next(Object.assign(action, { type: CALL_API_LOCAL_START }));

    return new Promise((resolve, reject) => {
        var response;
        switch(endpoint) {
            case 'config/init':
            case 'config/save':
                response = Object.assign(configCache, defaultConfig, data[1]);
                break;
            case 'config/load':
                response = configCache;
                break;
            case 'config/reset':
                response = Object.assign(configCache, defaultConfig);
                break;
            default:
                response = {code: 404, msg: `${endpoint} not implements`};
                next({
                    type: CALL_API_LOCAL_FAIL,
                    apiActionType: apiActionType,
                    error: response
                });
                return reject(response);
        }

        next({
            type: apiActionType,
            response
        });

        return resolve(response);
    });
}