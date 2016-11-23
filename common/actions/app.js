import * as ActionTypes from '../constants/app'
import asyncActionCreator from '../../utils/asyncActionCreator'

export function showProgress(progress) {
    return {
        type: ActionTypes.APP_PROGRESS_SHOW,
        progress
    }
}

export function hideProgress() {
    return {
        type: ActionTypes.APP_PROGRESS_HIDE
    }
}

export function alert(msg, alertType) {
    return {
        type: ActionTypes.APP_ALERT_MSG,
        alertType,
        msg,
        timestamp: +new Date()
    }
}

export const confirm = asyncActionCreator((msg, alertType) => ({
    type: ActionTypes.APP_CONFIRM_SHOW,
    alertType,
    msg,
    timestamp: +new Date()
}))

export function confirmOK() {
    return {
        type: ActionTypes.APP_CONFIRM_OK
    }
}

export function confirmClose() {
    return {
        type: ActionTypes.APP_CONFIRM_CLOSE
    }
}