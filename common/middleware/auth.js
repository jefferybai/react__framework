"use strict";
/**
 * 登录认证中间件，处理多种情况下，认证成功或失败的处理。
 */

import { LOGIN, LOGOUT, QUERY } from '../constants/login'
import { CALL_API_HTTP_START, CALL_API_HTTP_FAIL } from '../constants/api_http'

export default store => next => action => {
    //通过根路径访问应用，在route.js执行的query后，讲查询到的用户信息
    if (action.type == '@@router/LOCATION_CHANGE') {
        var state = action.payload.state;
        var loginUser = state && state.loginUser;

        if (loginUser) {
            if (JSON.stringify(loginUser) == '{}') {
                next({
                    type: CALL_API_HTTP_FAIL,
                    apiActionType: QUERY,
                    error: {code: 401}
                });
            } else {
                next({
                    type: QUERY,
                    response: loginUser
                });
            }
        }
    }

    //登录/登出前，清空本地用户信息缓存
    if (action.type == CALL_API_HTTP_START) {
        if (action.apiActionType == LOGOUT || action.apiActionType == QUERY) {
            localStorage.removeItem('loginUser');
        }
    }

    //登录后，写入本地用户信息缓存
    if (action.type == LOGIN) {
        localStorage.setItem('loginUser', JSON.stringify(action.response));
    }

    //fix userService query接口有时未登陆返回200，{}的bug，这种情况当作登录认证失败处理
    if (action.type == QUERY && JSON.stringify(action.response) == '{}') {
        next({
            type: CALL_API_HTTP_FAIL,
            apiActionType: action.type,
            error: {code: 401}
        })
        return action.response;
    }

    return next(action);
}