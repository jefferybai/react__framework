import React, { Component, PropTypes } from 'react'
import * as extension from './extensionBrige'
import tplRender from './index.jsx'

class Floatbar extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            isShoting: false,
            isSavingPdf: false
        }
    }

    render() {
        return tplRender.bind(this)()
    }

    itemClickHandle(type) {
        const { isShoting, isSavingPdf } = this.state
        if (isShoting || isSavingPdf) {
            return
        }

        switch (type) {
            case 'gotoTop':
                if(document.body.scrollTop){
                  document.body.scrollTop = 0  
                }else if(document.documentElement.scrollTop){
                  document.documentElement.scrollTop=0   
                }else if(window.pageYOffset){
                  window.pageYOffset=0
                }
                break;

            default:
                break;
        }

        const { onItemClick } = this.props
        onItemClick && onItemClick(type)
    }

    shotScreen(config) {
        this.setState({
            isShoting: true
        })
        return extension.shotScreen(config)
            .then(screenshot => {
                this.setState({
                    isShoting: false
                })
                return screenshot
            })
            .catch(() => {
                this.setState({
                    isShoting: false
                })
                return Promise.reject('shotScreen fail')
            })
    }

    savePdf(config) {
        this.setState({
            isSavingPdf: true
        })
        return extension.savePdf(config)
            .then(file => {
                this.setState({
                    isSavingPdf: false
                })
                return file
            })
            .catch(() => {
                this.setState({
                    isSavingPdf: false
                })
                return Promise.reject('savePdf fail')
            })
    }
}

export default Floatbar