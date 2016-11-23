"use strict";
/**
 * 异常处理中间件模块
 */
import '../../utils/console'
import { alert } from '../actions/app'
import { CALL_API_HTTP_FAIL } from '../constants/api_http'
import { QUERY, LOGOUT } from '../constants/login'

var defaultErrorCodeMap = {
    401: "登录失效，请重新登陆！",
    415: "用户名或密码不正确",
}

/**
 * 异常处理中间件生成函数，需要传入一个errorCodeMap
 * @param {object||function} [errorCodeMap] 普通js对象或函数. 需要通过系统弹出框显示提示的错误码以及提示信息. 
 *                      如果是函数，则函数需要返回errorCodeMap，该会每次执行，切会被注入两各参数，
 *                      err：服务端返回的错误json对象，store: redux的store
 * @return {function} redux middleware
 */
export default errorCodeMap => {
    if (typeof errorCodeMap == 'object') {
        errorCodeMap = Object.assign({}, defaultErrorCodeMap, errorCodeMap);
    }

    return store => next => action => {
        if (action.type !== CALL_API_HTTP_FAIL) {
            return next(action)
        }

        var isLoginPage = location.hash.split('?')[0] == '#/login'
        var error = action.error
        if (action.apiActionType == QUERY) {
            if (!isLoginPage) {
                location.hash = '#/login'
            }
            return next({type: LOGOUT})
        }

        if (!(error instanceof Error)) {
            var msg = ''
            switch(error.code) {
                case 401:
                    if (isLoginPage) { return next({type: LOGOUT}) }
                    location.hash = '#/login'
                default:
                    if (typeof errorCodeMap == 'function') {
                        errorCodeMap = errorCodeMap(error, store);
                    }
                    msg = errorCodeMap[error.code]||null
                    break;
            }
            console.error(error)
            if (msg) {
                next(alert(msg))
            }
            return next(action)
        } else {
            console.error(action)
            throw error;
        }
    }
}