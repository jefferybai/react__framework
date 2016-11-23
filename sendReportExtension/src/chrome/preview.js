window.addEventListener('load', function() {
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
        if (!Array.isArray(backgroundPage.cacheScreenShotDataUrl)) {
            var dataurls = [backgroundPage.cacheScreenShotDataUrl]
        } else {
            var dataurls = backgroundPage.cacheScreenShotDataUrl
        }
        var body = document.body;
        dataurls.forEach(function(dataUrl) {
            var img = document.createElement("img");
            img.src = dataUrl
            body.appendChild(img)
        })
    })
})