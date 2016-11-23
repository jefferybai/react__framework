import * as constants from './constants'
import imgGenerator from './imgGenerator'

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostContains: 'paratera.com' },
                })
            ],
            // ... show the page action.
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }])
    })
})

// chrome.pageAction.onClicked.addListener(function() {
// })

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name != constants.EXTENSION_ID) {
        port.disconnect()
        return
    }

    port.postMessage({ cmd: constants.COMMAND_CONNECT_BG_INIT })

    port.onMessage.addListener(function(msg) {
        switch (msg.cmd) {
            case constants.COMMAND_CONNECT_BG_INIT_DONE:
                imgGenerator.init()
            case constants.COMMAND_SCROLLNEXT_DONE:
                chrome.tabs.captureVisibleTab(function(data) {
                    imgGenerator.push({
                        dataurl: data,
                        datasize: data.length,
                        x: msg.x,
                        y: msg.y
                    })
                    port.postMessage({ cmd: constants.COMMAND_SCROLLNEXT })
                })
                break

            case constants.COMMAND_SCROLLDONE_COMPLETE:
                var promise
                if (msg.isSavePdf) {
                    promise = imgGenerator.generatePdf(msg)
                    .then(function(pdfDoc) {
                        if (msg.config.saveAs) {
                            pdfDoc.save(msg.config.saveAs.toString())
                        }
                        port.postMessage({
                            cmd: constants.COMMAND_SAVE_PDF_SUCCESS,
                            attachments: [pdfDoc.output('dataurlstring')]
                        })
                    })
                } else {
                    promise = imgGenerator.generate(msg)
                    .then(function(dataUrls) {
                        port.postMessage({
                            cmd: constants.COMMAND_SHOT_SCREEN_SUCCESS,
                            attachments: dataUrls
                        })
                        if (process.env.NODE_ENV !== 'production') {
                            window.cacheScreenShotDataUrl = dataUrls
                            chrome.tabs.create({ url: 'preview.html' })
                        }
                    })
                }
                promise
                    .then(function(dataUrl) {
                        port.disconnect()
                    })
                    .catch(onImgGenerateFail)
                break
        }
    })

    function onImgGenerateFail(msg) {
        port.postMessage({ cmd: msg.isSavePdf ? constants.COMMAND_SAVE_PDF_FAIL : constants.COMMAND_SHOT_SCREEN_FAIL })
        port.disconnect()
    }
})