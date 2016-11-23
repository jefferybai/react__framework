import asyncActionCreator from 'libs/utils/asyncActionCreator'
import { CALL_API_LOCAL } from '../constants/api_local'
import * as ActionTypes from '../constants/config'

/**
 * 初始化用户配置
 * @param {object} config 配置对象
 */
export const init = asyncActionCreator((username, config) => ({
    type: CALL_API_LOCAL,
    apiActionType: ActionTypes.CONFIG_INIT,
    endpoint: 'config/init',
    data: [username, config]
}));

/**
 * 加载用户配置
 * @param {object} config 配置对象
 */
export const load = asyncActionCreator(username => ({
    type: CALL_API_LOCAL,
    apiActionType: ActionTypes.CONFIG_LOAD,
    endpoint: 'config/load',
    data: username
}));

/**
 * 保存用户配置
 * @param {object} config 配置对象
 */
export const save = asyncActionCreator((username, config) => ({
    type: CALL_API_LOCAL,
    apiActionType: ActionTypes.CONFIG_SAVE,
    endpoint: 'config/save',
    data: [username, config]
}));

/**
 * 重置为默认配置
 */
export const reset = asyncActionCreator(username => ({
    type: CALL_API_LOCAL,
    apiActionType: ActionTypes.CONFIG_RESET,
    endpoint: 'config/reset',
    data: username
}));