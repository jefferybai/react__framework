import { LOGIN, QUERY, LOGOUT } from '../constants/login'

export default function login(state = null, action) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, action.response)
        case QUERY:
            //QUERY接口查询到没登录，设置loginUser=0，用于刷新App
            return JSON.stringify(action.response)=='{}'?null:Object.assign({}, action.response)
        case LOGOUT:
            return null
        default:
            return JSON.parse(localStorage.getItem('loginUser')) || state
    }
}