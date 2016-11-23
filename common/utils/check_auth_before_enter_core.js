/**
 * 核心模块。进入应用前检测是否已认证，如果没有则跳转到登录页，否则跳转到索引页
 */
import { USER_SERVICE_BASEPATH } from '../constants/api_http'

/**
 * @param {string} callApiProxy 调用并行api的代理函数
 * @param {string} indexPath 检测到已登录时，跳转到该路径
 * @param {string} loginPath 检测到未登录时，跳转到该路径, 默认为'/login'
 */
export default function checkAuthBeforeEnterCore(callApiProxy, indexPath, loginPath) {
    var isFirst = true;
    loginPath = loginPath||'/login';
    return function (nextState, replace, cb) {
        if (!isFirst) {
            return cb();
        }
        callApiProxy({
            url: USER_SERVICE_BASEPATH + "/query",
            acceptType: 'json',
            data: {
                token_type: 'COOKIE',
                winfo: true
            }
        })
            .catch(err => {
                isFirst = false;
                replace(loginPath);
                cb()
            })
            .then(result => {
                isFirst = false;
                if (JSON.stringify(result) == '{}') {
                    replace(loginPath)
                } else {
                    replace({
                        pathname: indexPath,
                        state: { loginUser: result }
                    })
                }
                cb()
            });
    }
}