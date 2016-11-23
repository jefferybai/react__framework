var captures = []

function loadImages(msg) {
    return new Promise(function(resolve, reject) {
        var imagesPending = captures.length
        var hasFail = false

        captures.forEach(function(capture) {
            var img = new Image

            img.onload = imgOnload.bind(img, capture)

            img.onerror = imgOnError.bind(img, capture)

            img.src = capture.dataurl
        })

        function imgOnload(capture) {
            capture.dataurl = null
            capture.img = this

            if (--imagesPending == 0) {
                done()
            }
        }

        function imgOnError(capture) {
            capture.dataurl = null

            if (--imagesPending == 0) {
                done()
            }
        }

        function done() {
            if (hasFail) {
                reject(msg)
            } else {
                resolve(msg)
            }
        }
    })
}

function mergeCaptures(msg) {
    var devicePixelRatio = msg.devicePixelRatio,
        nRows = msg.rows,
        nCols = msg.cols,
        config = msg.config,
        nShiftX = 0,
        nShiftY = 0,
        canvasWidth = (msg.width - (config.offsetLeft || 0) - (config.offsetRight || 0)) * devicePixelRatio,
        canvasHeight = (msg.height - (config.offsetTop || 0) - (config.offsetBottom || 0)) * devicePixelRatio;

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    canvas.width = Math.max(1, canvasWidth)
    canvas.height = Math.max(1, canvasHeight)

    captures.forEach(function(capture, cntr) {
        var nSliceX = capture.x,
            nSliceY = capture.y,
            pObject = capture.img,
            imgWidth = pObject.width,
            imgHeight = pObject.height,
            sx = (config.offsetLeft || 0) * devicePixelRatio,
            sy = 0,
            sHeight = imgHeight;

        if (cntr == 0) {
            sy = (config.offsetTop || 0) * devicePixelRatio
            sHeight = imgHeight - sy
            nShiftX = nSliceX
            nShiftY = (config.offsetTop || 0)
            nSliceY = (config.offsetTop || 0)
        }

        if (cntr == captures.length) {
            sHeight = imgHeight - sy
        }

        var dx = (nSliceX - nShiftX) * devicePixelRatio
        var dy = (nSliceY - nShiftY) * devicePixelRatio

        ctx.drawImage(pObject, sx, sy, canvasWidth, sHeight, dx, dy, canvasWidth, sHeight)
    })

    return canvas
}

function sliceCaptures(msg, imageSource) {
    var devicePixelRatio = msg.devicePixelRatio
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var width = imageSource.width
    var sy = 0
    var sliceConfig = msg.config.slice||[imageSource.height]
    var slices = []

    sliceConfig.forEach(function(slice) {
        var height = slice*devicePixelRatio
        canvas.width = width
        canvas.height = height
        ctx.drawImage(imageSource, 0, sy, width, height, 0, 0, width, height)
        sy += height
        slices.push({
            width: width,
            height: height,
            dataUrl: canvas.toDataURL(msg.config.mimeType || 'image/jpeg', parseFloat(msg.config.quality) || 0.8)
        })
    })
    
    return slices
}

function createPdf(msg, slices) {
    var doc = new jsPDF('p', 'mm', 'a4', false);
    var dpi = js_getDPI();
    //每个点的长度，单位mm
    var mmpd = [25.4/dpi[0], 25.4/dpi[1]];
    var padding = msg.config.pdfPagePadding||[0,0,0,0];

    slices.forEach(function(slice, i) {
        var dataurl = slice.dataUrl,
            imgWidth = slice.width*mmpd[0],
            imgHeight = slice.height*mmpd[1];

        if (i > 0 ) {
            doc.addPage();
        }

        var w = Math.min(210-padding[1]-padding[3], imgWidth);
        var h = Math.min(297-padding[0]-padding[2], imgHeight);

        var wScaleRatio = w/imgWidth;
        var hScaleRatio = h/imgHeight;

        if (wScaleRatio > hScaleRatio) {
            //左对齐
            doc.addImage(dataurl, 'jpg', padding[3], padding[0], imgWidth*hScaleRatio, h);
            //居中
            //doc.addImage(dataurl, 'jpg', (210-imgWidth*hScaleRatio)/2, 0, imgWidth*hScaleRatio, h);
        } else {
            doc.addImage(dataurl, 'jpg', padding[3], padding[0], w, imgHeight*wScaleRatio);
        }
    })
    return doc
}

function js_getDPI() {
    var arrDPI = new Array();
    if (window.screen.deviceXDPI != undefined) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI;
}

export default {
    init: function() {
        captures = []
    },

    push: function(data) {
        captures.push(data)
    },

    generate: function(msg) {
        return loadImages(msg)
            .then(mergeCaptures)
            .then(function(canvas) {
                if (Array.isArray(msg.config.slice)) {
                    return sliceCaptures(msg, canvas).map(function(slice) {
                        return slice.dataUrl
                    })
                } else {
                    return [canvas.toDataURL(msg.config.mimeType || 'image/jpeg', parseFloat(msg.config.quality) || 0.8)]
                }
            })
            .catch((e) => Promise.reject(e))
    },

    generatePdf: function(msg) {
        return loadImages(msg)
            .then(mergeCaptures)
            .then(sliceCaptures.bind(null, msg))
            .then(createPdf.bind(null, msg))
            .catch((e) => Promise.reject(e))
    }
}