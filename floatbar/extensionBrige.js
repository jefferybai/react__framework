import versionCompare from './version_compare'

const EXTENSION_ID = 'iejbbakpjepnegplaaojckdnnfgbnpgg'
const EXTENSION_VERSION = '1.1.1'
const COMMAND_SHOT_SCREEN = 'COMMAND_SHOT_SCREEN'
const COMMAND_SHOT_SCREEN_STARTED = 'COMMAND_SHOT_SCREEN_STARTED'
const COMMAND_SHOT_SCREEN_FAIL = 'COMMAND_SHOT_SCREEN_FAIL'
const COMMAND_SHOT_SCREEN_SUCCESS = 'COMMAND_SHOT_SCREEN_SUCCESS'
const COMMAND_SAVE_PDF = 'COMMAND_SAVE_PDF'
const COMMAND_SAVE_PDF_STARTED = 'COMMAND_SAVE_PDF_STARTED'
const COMMAND_SAVE_PDF_FAIL = 'COMMAND_SAVE_PDF_FAIL'
const COMMAND_SAVE_PDF_SUCCESS = 'COMMAND_SAVE_PDF_SUCCESS'

var curTask
var curTaskStatus

function* taskGenerator(cmd, config, resolve, reject) {
    window.removeEventListener("message", onMessage)
    window.addEventListener("message", onMessage, false)
    postMessage({
        extensionId: EXTENSION_ID,
        cmd: cmd,
        version: EXTENSION_VERSION,
        config
    }, "*")
    yield 'request start'

    let isSuccess = yield 'running'

    isSuccess?resolve(isSuccess):reject('extension error')
    window.removeEventListener("message", onMessage)
    return 'complete'
}

function requestStart() {
    return 'request start'
}

function onMessage(params) {
    var data = event.data
    if (event.source != window || data.extensionId !== EXTENSION_ID)
        return;

    if (data.version === undefined || versionCompare(data.version || '0.0.0', EXTENSION_VERSION) < 0) {
        if (confirm('您的paraSendMail扩展程序版本过低，请卸载老扩展。是否前往下载最新版？')) {
            window.open('https://oits.paratera.com/report/chrome_extension/index.html')
        }
        return
    }

    switch (data.cmd) {
        case COMMAND_SHOT_SCREEN_STARTED:
        case COMMAND_SAVE_PDF_STARTED:
            curTaskStatus = curTask.next()
            break;

        case COMMAND_SHOT_SCREEN_FAIL:
        case COMMAND_SAVE_PDF_FAIL:
            curTaskStatus = curTask.next(false)
            break;

        case COMMAND_SHOT_SCREEN_SUCCESS:
        case COMMAND_SAVE_PDF_SUCCESS:
            curTaskStatus = curTask.next(data.attachments)
            break;

        default:
            break;
    }
}

function tryRunTask(cmd, config) {
    if (curTaskStatus && !curTaskStatus.done) {
        return Promise.reject('task is running')
    }
    return new Promise(function(resolve, reject) {
        curTask = taskGenerator(cmd, config, resolve, reject)
        curTaskStatus = curTask.next()
        setTimeout(() => {
            if (curTaskStatus.value != 'running') {
                if (confirm('您可能没有安装发送报告扩展程序，是否前往下载？')) {
                    window.open('https://oits.paratera.com/report/chrome_extension/index.html')
                }
                curTask = null
                curTaskStatus = null
                reject('no extension')
            }
        }, 1000)
    })
}

export function shotScreen(config) {
    return tryRunTask(COMMAND_SHOT_SCREEN, config)
}

export function savePdf(config) {
    return tryRunTask(COMMAND_SAVE_PDF, config)
}