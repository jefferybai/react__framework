export default function asyncActionCreator(fn) {
    return (...args) => (dispatch, getState) => dispatch(fn(...args))
}