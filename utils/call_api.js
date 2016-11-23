"use strict";
/**
 * 调用符合公司规范的*.paratera.com的api的公用方法
 */
import { encodeQueryParam } from './queryParam';

//默认的accept头的配置
var acceptTypes = {
    json: 'application/json, text/javascript, */*',
    text: 'text/javascript, */*',
    stream: 'application/octet-stream'
};

function formDataAppend(key, val) {
    if (val instanceof Blob) {
        this.append(key, val, val.name)
    } else {
        this.append(key, val)
    }
}

/**
 * 设置request的content-type和body
 * @param {object} params fetch方法的params
 * @param {string} [contentType] 详见callApi方法中的contentType说明
 * @param {any} [data] 请求参数的数据，详见callApi方法中的contentType说明
 */
function setRequestBodyByContentType(params, contentType, data) {
    switch (contentType) {
        case 'json':
            params.body = JSON.stringify(data)
            params.headers['Content-Type'] = 'application/json'
            break
        case 'form':
            params.body = Object.keys(data).map(key => key + "=" + data[key]).join('&')
            params.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            break
        case 'formData':
            if (typeof FormData != 'function') {
                return Promise.reject('FormData not supported')
            }
            if (data instanceof FormData) {
                params.body = data
            } else {
                var formData = new FormData()
                Object.keys(data).forEach(key => {
                    var val = data[key]
                    if (Array.isArray(val) || (val instanceof FileList)) {
                        for (var i = 0; i < val.length; i++) {
                            formDataAppend.call(formData, key, val[i])
                        }
                    } else {
                        formDataAppend.call(formData, key, val)
                    }
                })
                params.body = formData
            }
            break
        default:
            if (typeof contentType == 'string') {
                params.headers['Content-Type'] = contentType
            }
            params.body = data
            break
    }
}

/**
 * 请求响应处理函数
 */
function fetchDone(accept, response) {
    function parseResponse(accept, response, cb) {
        switch (accept) {
            case 'text':
                return response.text().then(cb);
            case 'json':
                return response.json().then(cb);
            default:
                return cb(response.body);
        }
    }
    return new Promise((resolve, reject) => {
        if (response.ok) {
            parseResponse(accept, response, resolve);
        } else {
            parseResponse('json', response, reject);
        }
    })
}

/**
 * 调用服务端http api
 * @param {object} option 配置
 * @param {string} option.method 请求method, head|get|post|put|delete
 * @param {string} option.url 请求地址
 * @param {object|string|buffer|stream|blob} [option.data] 请求参数
 * @param {string} [option.contentType] 请求参数的数据格式, 默认为json, 可选的值有：json|form|formData
 *      json: option.data必须是object，会添加header 'Content-Type': 'application/json'.
 *      form: form-urlencoded格式，option.data必须是object，会添加header 'Content-Type': 'application/x-www-form-urlencoded'.
 *      formData: multipart/form-data格式，option.data必须是object或者是FormData实例，需要支持FormData
 *      any string: 除上面几种外的任意字符串，会添加header 'Content-Type'： option.contentType
 *          option.data会直接作为request.body
 * @param {string} [option.acceptType] 请求参数的数据格式, 默认为json, 可选的值有：json|text|stream
 *      json: 会添加header 'Accept': 'application/json, text/javascript, *\/*'. 
 *          且respons会被尝试解析为json对象，不成功则解析为text返回
 *      text: 会添加header 'Accept': 'text/javascript, *\/*'. 且respons会被尝试解析为text
 *      stream: 会添加header 'Accept': 'application/octet-stream'. 且respons会直接返回，不会尝试解析
 */
function callApi(option) {
    var url = option.url;
    var method = (option.method || 'GET').toUpperCase();
    var data = option.data;
    var contentType = option.contentType || 'json';
    var headers = option.headers || null;
    var accept = acceptTypes[option.acceptType];
    var params = {
        method: method,
        headers: {},
        mode: 'cors',
        credentials: 'include'
    }

    if (accept) {
        params.headers['Accept'] = accept;
    }

    if (headers) {
        Object.keys(headers).forEach(key => {
            params.headers[key] = headers[key]
        })
    }

    if (data) {
        if (!['GET', 'HEAD'].includes(method)) {
            setRequestBodyByContentType(params, contentType, data)
        } else {
            if (url.indexOf('?') == -1) {
                url = url + '?' + encodeQueryParam(data)
            } else {
                url = url + '&' + encodeQueryParam(data)
            }
        }
    }

    return fetch(url, params).then(fetchDone.bind(null, option.acceptType));
}

export default callApi;