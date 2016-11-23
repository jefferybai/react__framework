import { APP_CONFIRM_SHOW, APP_CONFIRM_OK, APP_CONFIRM_CLOSE } from '../constants/app'
import { confirm, cancelConfirm } from '../actions/app'

var curConfirm = null;
var lastConfirm = null;
export default store => next => action => {
    var type = action.type;
    var confirmNext = () => {
        if (curConfirm && curConfirm.next && curConfirm.next != curConfirm) {
            curConfirm = curConfirm.next;
            return next(curConfirm.action);
        } else {
            curConfirm = null;
            lastConfirm = null;
        }
    }

    if (type == APP_CONFIRM_SHOW) {
        var confirmInfo = {};

        confirmInfo.action = action;
        confirmInfo.promise = new Promise((resolve, reject) => {
            confirmInfo.resolveCache = resolve;
            confirmInfo.rejectCache = reject;
        });

        if (!curConfirm) {
            lastConfirm = curConfirm = confirmInfo;
            next(action);
        }

        confirmInfo.promise
            .then(confirmNext)
            .catch(confirmNext);

        if (lastConfirm != confirmInfo) {
            lastConfirm.next = confirmInfo;
            lastConfirm = confirmInfo;
        }

        return confirmInfo.promise;
    }

    if (type == APP_CONFIRM_OK) {
        curConfirm.resolveCache();
    }

    if (type == APP_CONFIRM_CLOSE) {
        if (confirmNext()) {
            return;
        } else {
            return next(action);
        }
    }

    return next(action);
}