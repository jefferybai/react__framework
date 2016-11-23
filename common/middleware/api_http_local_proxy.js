import httpApiProxy from '../client_api_service/http_api_proxy'
import { CALL_API_HTTP, CALL_API_HTTP_START, CALL_API_HTTP_FAIL, USER_SERVICE_BASEPATH } from '../constants/api_http'

// A Redux middleware that interprets actions with CALL_API_HTTP info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
    if (action.type !== CALL_API_HTTP) {
        return next(action)
    }

    let {
        apiActionType,
        basepath = '/',
        endpoint,
        method = 'GET',
        data,
        contentType = "json",
        acceptType = "json"
    } = action

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if (!['object', 'undefined', 'string'].includes(typeof data)) {
        throw new Error('Expected data to be object')
    }

    next(Object.assign(action, { type: CALL_API_HTTP_START }))

    //是否是服务端未捕获的错误
    return httpApiProxy({
        url: basepath + "/" + endpoint,
        method: method.toUpperCase(),
        contentType: contentType,
        acceptType: acceptType,
        data: data
    })
        .catch(e => {
            next({
                type: CALL_API_HTTP_FAIL,
                apiActionType: apiActionType,
                error: e
            });
            return Promise.reject(e);
        })
        .then(response => {
            next({
                response,
                type: apiActionType
            })
            return response
        })
}