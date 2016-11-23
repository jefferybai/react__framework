var os = require('os');
var fs = require('fs');
var path = require('path');
var https = require('https');
var fetch = require('node-fetch');
var querystring = require('querystring');
var FormData = require('form-data');

const USER_SERVICE_BASEPATH = 'https://user.paratera.com';

var isParateraApi = /^https?:\/\/([a-zA-Z0-9_-]+\.)*paratera\.com/;
var cookiesCache = [];
var isTest = process.env.NODE_ENV_PARA == 'test';

var acceptTypes = {
    json: 'application/json, text/javascript, */*',
    text: 'text/javascript, */*',
    stream: 'application/octet-stream'
}

function formDataAppend(key, val) {
    if (val instanceof File) {
        this.append(key, fs.createReadStream(val.path), val.name)
    } else if (val instanceof Blob) {
        throw new Error('not supported form-data value');
    } else {
        this.append(key, val)
    }
}

/**
 * 设置request的content-type和body
 * @param {object} params 生成的cookie对象除name和value之外的配置项的默认值
 * @param {string} [contentType] request header 'Content-Type'值， 可选的值有：json|form|formData|other any string
 *      json: option.data必须是object，会添加header 'Content-Type': 'application/json'.
 *      form: form-urlencoded格式，option.data必须是object，会添加header 'Content-Type': 'application/x-www-form-urlencoded'.
 *      formData: multipart/form-data格式，option.data必须是object或者是FormData实例，需要支持FormData
 *      any string: 除上面几种外的任意字符串，会添加header 'Content-Type'： option.contentType
 *          option.data会直接作为request.body
 * @param {any} [data] 请求参数的数据，data类型跟contentType有关，详细看contentType参数说明。
 */
function setRequestBodyByContentType(params, contentType, data) {
    switch(contentType) {
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
                    if (Array.isArray(val)||(val instanceof FileList)) {
                        for (var i = 0 ; i < val.length; i ++) {
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
 * cookie字符串为cookie对象
 * @param {string} str 服务端返回的cookie字符串
 * @param {object} defaults 生成的cookie对象除name和value之外的配置项的默认值
 * @param {number} [defaults.expirationDate] cookie默认有效期，cookie生成后存在的秒数
 * @param {string} [defaults.path] cookie默认path
 * @param {string} [defaults.domain] cookie默认domain
 * @param {boolean} [defaults.secure] cookie默认secure
 * @param {boolean} [defaults.httpOnly] cookie默认httpOnly
 * @return {object} {name, value, [expirationDate], [path], [domain], [secure], [httpOnly]}
 */
function parseCookie(str, defaults) {
    var cookie = {};
    var pairs = [];
    var parts = str.split(/ *; */);
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split(/ *= */);
        pairs.push(pair);
    }

    var firstPair = pairs.shift();
    cookie.name = firstPair[0];
    cookie.value = firstPair[1];
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var key = pair[0].toLowerCase();
        var value = pair[1];

        switch(key) {
            case 'expires':
                if (!cookie.expirationDate) {
                    cookie.expirationDate = Math.floor(+new Date(value)/1000);
                }
                break;
            case 'max-age':
                if (!isNaN(value)) {
                    cookie.expirationDate = Math.floor(+new Date()/1000 + parseFloat(value));
                }
                break;
            case 'path':
            case 'domain':
                cookie[key] = value;
                break;
            case 'secure':
                cookie.secure = true;
            case 'httponly':
                cookie.httpOnly = true;
                break;
        }
    }

    if (!cookie.expirationDate && defaults.expirationDate) {
        cookie.expirationDate = defaults.expirationDate;
    }

    if (!cookie.path && defaults.path) {
        cookie.path = defaults.path;
    }

    if (!cookie.domain && defaults.domain) {
        cookie.domain = defaults.domain;
    }

    if (cookie.secure === undefined && defaults.secure !== undefined) {
        cookie.secure = defaults.secure;
    }

    if (cookie.httpOnly === undefined && defaults.httpOnly !== undefined) {
        cookie.httpOnly = defaults.httpOnly;
    }

    return cookie;
}

/**
 * 接收服务端返回的set-cookie数组，解析并调用chrome.cookies api保存cookie
 * @param {array} headerCookies 服务端返回的cookies数组，每一项是cookie字符串
 * @param {function} cb 回调函数，第一个参数是解析后的cookies数组，每一项是cookie对象
 */
function setCookies(headerCookies, cb) {
    var len = headerCookies.length;
    var successed = 0
    var cookies = []
    headerCookies.map(cookieStr => {
        var cookie = parseCookie(cookieStr, {
            //默认30天有效期
            expirationDate: Math.floor(+new Date()/1000 + parseFloat(30*24*3600))
        })

        cookies.push(cookie)
        cookiesCache.push(cookie)

        if (isTest) {
            cb(cookiesCache)
        } else {
            chrome.cookies.set(Object.assign({url: USER_SERVICE_BASEPATH}, cookie), (cookie) => {
                if (!cookie) {
                    cb(null)
                } else {
                    if (++successed == len) {
                        cb(cookies)
                    }
                }
            })
        }
    })
}

/**
 * 移除所有保存的cookie
 */
function removeCookies() {
    if (isTest) {
        cookiesCache = []
    } else {
        chrome.cookies.getAll({}, (cookies) => {
            cookies.forEach(cookie => {
                chrome.cookies.remove({
                    url: USER_SERVICE_BASEPATH,
                    name: cookie.name
                })
            })
        })
    }
}

/**
 * 请求响应处理函数
 */
function fetchDone(accept, response) {
    function parseResponse(accept, response, cb) {
        switch (accept) {
            case 'text':
                return response.text().then(result=>{
                    console.log(result);
                    cb(result);
                });
            case 'json':
                return response.json().then(result=>{
                    console.log(result);
                    cb(result);
                });
            default:
                return cb(response.body);
        }
    }
    return new Promise((resolve, reject) => {
        console.log(response);
        if (response.ok) {
            if (response.url.indexOf(USER_SERVICE_BASEPATH+'/user/api/login') === 0) {
                setCookies(response.headers.getAll('set-cookie'), cookies => {
                    parseResponse(accept, response, resolve);
                });
                return;
            } else if (response.url.indexOf(USER_SERVICE_BASEPATH+'/user/api/logout') === 0) {
                removeCookies();
            }
            parseResponse(accept, response, resolve);
        } else {
            parseResponse('json', response, reject);
        }
    })
}

/**
 * 发送请求
 */
function fetchSend(url, params, option, resolve, reject) {
    console.log(`fetch ${url}. params=`)
    console.log(params)
    fetch(url, params)
        .then(fetchDone.bind(null, option.acceptType))
        .then(resolve)
        .catch(reject)
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
    return new Promise((resolve, reject) => {
        var url = option.url;
        var method = (option.method||'GET').toUpperCase();
        var data = option.data;
        var contentType = option.contentType||'json';
        var headers = option.headers||null;
        var accept = acceptTypes[option.acceptType];
        var params = {
            method: method,
            headers: {}
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
            if (method != 'GET' && method != 'HEAD') {
                setRequestBodyByContentType(params, contentType, data)
            } else {
                if (url.indexOf('?') == -1) {
                    url = url + '?' + querystring.stringify(data)
                } else {
                    url = url + '&' + querystring.stringify(data)
                }
            }
        }

        if (process.env.NODE_ENV !== 'production' && url.indexOf('https') === 0) {
            params.agent = new https.Agent({
                rejectUnauthorized: false
            })
        }

        if (isParateraApi.test(url) && !isTest) {
            chrome.cookies.getAll({url}, (cookies) => {
                params.headers['Cookie'] = cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ')
                fetchSend(url, params, option, resolve, reject)
            })
        } else {
            if (isTest) {
                params.headers['Cookie'] = cookiesCache.map(cookie => cookie.name + '=' + cookie.value).join('; ')
            }
            fetchSend(url, params, option, resolve, reject)
        }
    })
}

module.exports = callApi