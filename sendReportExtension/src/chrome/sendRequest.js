import { REQUEST_URL } from './constants'

export default function(params) {
    var formData = new FormData()
    formData.append('subject', params.subject||'test mail')
    formData.append('body', params.body||'')
    params.attachments.forEach(attachment => {
        formData.append('files', attachment, attachment.name)
    })
    if (typeof params.otherParams == 'object') {
        Object.keys(params.otherParams).forEach( key => {
            formData.append(key, params.otherParams[key])
        })
    }

    return fetch(params.apiUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'PARA_TOKEN': params.PARA_TOKEN
        },
        body: formData,
        mode: 'cors',
        credentials: 'includes'
    })
}