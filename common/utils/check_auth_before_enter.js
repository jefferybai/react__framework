/**
 * 进入应用前检测是否已认证，如果没有则跳转到登录页，否则跳转到索引页
 */
import callApi from '../../utils/call_api'
import coreFn from './check_auth_before_enter_core'

/**
 * @param {string} indexPath 检测到已登录时，跳转到该路径
 * @param {string} loginPath 检测到未登录时，跳转到该路径, 默认为'/login'
 */
export default function checkAuthBeforeEnter(indexPath, loginPath) {
    return coreFn(callApi, indexPath, loginPath);
}