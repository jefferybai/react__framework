import * as ActionTypes from '../constants/app'

export function loadingProgress(state = 0, action) {
    switch (action.type) {
        case ActionTypes.APP_PROGRESS_SHOW:
            return action.progress||0;
        case ActionTypes.APP_PROGRESS_HIDE:
            return 100;
        default:
            return state;
    }
}

export function alert(state = {}, action) {
    switch (action.type) {
        case ActionTypes.APP_ALERT_MSG:
            return {
                type: action.alertType,
                msg: action.msg,
                timestamp: action.timestamp
            };
        default:
            return state;
    }
}

export function confirm(state = {}, action) {
    switch (action.type) {
        case ActionTypes.APP_CONFIRM_SHOW:
            return {
                type: action.alertType,
                msg: action.msg,
                timestamp: action.timestamp
            };
        case ActionTypes.APP_CONFIRM_OK:
        case ActionTypes.APP_CONFIRM_CLOSE:
            return null;
        default:
            return state;
    }
}