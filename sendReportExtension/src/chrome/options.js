// Saves options to chrome.storage.sync.
var quelityEl = document.getElementById('quality');
var mimeType1El = document.getElementById('mimeType1');
var mimeType2El = document.getElementById('mimeType2');
var filenameEl = document.getElementById('filename');
var statusEl = document.getElementById('status');
function save_options() {
    var mimeType = mimeType1El.checked ? mimeType1El.value : mimeType2El.value;
    var quelity = quelityEl.value;
    var filename = filenameEl.value;
    chrome.storage.sync.set({
        mimeType: mimeType,
        quality: quelity,
        filename: filename
    }, function() {
        // Update status to let user know options were saved.
        statusEl.textContent = '保存成功';
        setTimeout(function() {
            statusEl.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        mimeType: 'image/jpeg',
        quality: 0.8,
        filename: '集群运维报告'
    }, function(items) {
        quelityEl.value = items.quality;
        mimeType1El.checked = items.mimeType == 'image/png';
        mimeType2El.checked = items.mimeType == 'image/jpeg';
        filenameEl.value = items.filename;
        items.mimeType == 'image/png' ? disableQuelity() : enableQuelity()
    });
}

function disableQuelity() {
    quelityEl.disabled = true
}

function enableQuelity(params) {
    quelityEl.disabled = false
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
mimeType1El.addEventListener('click', disableQuelity);
mimeType2El.addEventListener('click', enableQuelity);