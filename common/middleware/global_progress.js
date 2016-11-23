import { alert } from '../actions/app'
import { showProgress, hideProgress } from '../actions/app'
import { CALL_API_HTTP_START, CALL_API_HTTP_DONE, CALL_API_HTTP_FAIL } from '../constants/api_http'

export default store => next => action => {
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
        case CALL_API_HTTP_START:
            next(showProgress());
            break;
    
        case CALL_API_HTTP_DONE:
        case CALL_API_HTTP_FAIL:
            next(hideProgress());
            break;
    }
    return next(action)
}