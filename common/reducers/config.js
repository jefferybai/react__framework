/**
 * 配置数据存储
 */

import * as ActionTypes from '../constants/config'

export default function config(state={}, action) {
    switch (action.type) {
        case ActionTypes.CONFIG_LOAD:
        case ActionTypes.CONFIG_SAVE:
        case ActionTypes.CONFIG_RESET:
            return action.response;
        default:
            return state;
    }
}