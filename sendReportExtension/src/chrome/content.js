import * as constants from './constants'
import manifest from './manifest.json'

function postMessageToPage(msg) {
    postMessage(Object.assign({
        extensionId: constants.EXTENSION_ID,
        version: manifest.version
    }, msg), "*")
}

window.addEventListener("message", function(event) {
    var data = event.data
    if (event.source != window || data.extensionId !== constants.EXTENSION_ID)
        return;

    switch (data.cmd) {
        case constants.COMMAND_SHOT_SCREEN:
            postMessageToPage({cmd: constants.COMMAND_SHOT_SCREEN_STARTED})
            connectBackground(data.config)
            break;

        case constants.COMMAND_SAVE_PDF:
            postMessageToPage({cmd: constants.COMMAND_SAVE_PDF_STARTED})
            connectBackground(data.config, true)
            break;

        default:
            break;
    }
}, false)


function connectBackground(config, isSavePdf) {
    var port = chrome.runtime.connect({ name: constants.EXTENSION_ID })
    var rows = 1,
        cols = 1,
        mode = 0,
        timeout = 50,
        vertMoving = true,
        clientWidth = 0,
        clientHeight = 0,
        doc, body, savedScrollTop, savedScrollLeft, docWidth, docHeight;

    port.onMessage.addListener(function(msg) {
        switch (msg.cmd) {
            case constants.COMMAND_CONNECT_BG_INIT:
                doc = window.document

                body = doc.body
                savedScrollTop = body.scrollTop
                savedScrollLeft = body.scrollLeft

                docWidth = Math.max(doc.documentElement.scrollWidth, body.scrollWidth)
                docHeight = Math.max(doc.documentElement.scrollHeight, body.scrollHeight)

                if (docWidth <= 0) docWidth = 1024
                if (docHeight <= 0) docHeight = 768

                body.scrollTop = 0
                body.scrollLeft = 0

                clientWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : body.clientWidth
                clientHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : body.clientHeight

                if (window.innerHeight <= clientHeight) {
                    docWidth = clientWidth
                }

                setTimeout(function() {
                    port.postMessage({ cmd: constants.COMMAND_CONNECT_BG_INIT_DONE, x: body.scrollLeft, y: body.scrollTop })
                }, timeout)
                break
            case constants.COMMAND_SCROLLNEXT:
                var savedPos

                if (vertMoving) {
                    savedPos = body.scrollTop
                    body.scrollTop += Math.max(0, clientHeight - 1)
                    vertMoving = savedPos != body.scrollTop && body.scrollTop < docHeight

                    if (vertMoving) {
                        rows++
                        body.scrollLeft = 0

                        setTimeout(function() {
                            setTimeout(function() {
                                port.postMessage({ cmd: constants.COMMAND_SCROLLNEXT_DONE, x: body.scrollLeft, y: body.scrollTop })
                            }, timeout)
                        }, timeout)

                        return
                    }
                }

                msg = {
                    cmd: constants.COMMAND_SCROLLDONE_COMPLETE,
                    isSavePdf,
                    width: docWidth,
                    height: docHeight,
                    devicePixelRatio: devicePixelRatio,
                    rows: rows,
                    cols: cols,
                    config: config||{
                        offsetTop: 0,
                        offsetBottom: 0,
                        offsetLeft: 0,
                        offsetRight: 0,
                        slice: []
                    }
                }

                body.scrollLeft = savedScrollLeft
                body.scrollTop = savedScrollTop

                setTimeout(function() {
                    port.postMessage(msg)
                }, timeout)
                break

            case constants.COMMAND_SHOT_SCREEN_FAIL:
            case constants.COMMAND_SHOT_SCREEN_SUCCESS:
            case constants.COMMAND_SAVE_PDF_FAIL:
            case constants.COMMAND_SAVE_PDF_SUCCESS:
                postMessageToPage(msg)
                break
        }
    })
}