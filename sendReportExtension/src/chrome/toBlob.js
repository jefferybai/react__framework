export default function toBlob(dataUrl, type = 'image/jpeg', name = 'blob') {
    var binStr = atob(dataUrl.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    var blob = new Blob([arr], { type: type })
    blob.name = name

    return blob
}