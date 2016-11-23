import React from 'react'
import classNames from 'classnames'
import styles from './style.less'

export default function render() {
    const { className, style } = this.props
    const { isShoting, isSavingPdf } = this.state
    
    let cls = {
        [styles.rootCls]: true,
        [styles.rootClsSending]: isShoting||isSavingPdf
    }

    let sendReportCls = {
        'glyphicon': true,
        'glyphicon-envelope': !isShoting,
        'glyphicon-hourglass': isShoting
    }
    
    let savePdfCls = {
        'glyphicon': true,
        'glyphicon-floppy-save': !isSavingPdf,
        'glyphicon-hourglass': isSavingPdf
    }

    return (
        <div className={classNames(cls) + ' ' + className} style={style}>
            <div className="item">
                <div className="item-inner"
                    onClick={this.itemClickHandle.bind(this, 'sendReport')}>
                    <span className={classNames(sendReportCls)}></span>
                    <div className="title">发送<br />报告</div>
                </div>
                <div className="popover left">
                    <div className="arrow"></div>
                    <div className="popover-content">
                        发送过程中，请不要做任何影响滚动条的操作。
                    </div>
                </div>
            </div>
            <div className="item">
                <div className="item-inner"
                    onClick={this.itemClickHandle.bind(this, 'savePdf')}>
                    <span className={classNames(savePdfCls)}></span>
                    <div className="title">保存<br />PDF</div>
                </div>
                <div className="popover left">
                    <div className="arrow"></div>
                    <div className="popover-content">
                        保存过程中，请不要做任何影响滚动条的操作。
                    </div>
                </div>
            </div>
            <div className="item">
                <div className="item-inner"
                    onClick={this.itemClickHandle.bind(this, 'gotoTop')}>
                    <span className="glyphicon glyphicon-circle-arrow-up"></span>
                    <div className="title">返回<br />顶部</div>
                </div>
            </div>
        </div>
    )
}