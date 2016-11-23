"use strict";
/*
 * 全局的确认框，替代浏览器的confirm方法
 * @props {number} type 显示类型
 * @props {number} msg 显示的消息
 * @props {number} timestamp 时间戳
 * @props {function} onOk 确定按钮点击事件
 * @props {function} onClose 取消按钮点击事件
 */
import React, { Component, PropTypes } from 'react'
import styles from './style.less'
import classNames from 'classnames'

const TYPE_INFO = 'info'
const TYPE_SUCCESS = 'success'
const TYPE_WARNING = 'warning'
const TYPE_TEXTS = {
    [TYPE_INFO]: '提示',
    [TYPE_SUCCESS]: '成功',
    [TYPE_WARNING]: '警告'
}

class TopConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true
        };
        this.oldValue = props.msg+props.timestamp;
    }

    componentWillReceiveProps(nextProps) {
        let { msg, timestamp } = nextProps;

        if (msg+timestamp == '0') {
            this.setState({hidden:true});
        } else if( msg+timestamp != this.oldValue ) {
            this.setState({hidden:false})
            this.oldValue = msg+timestamp;
        }
    }

    render() {
        const { msg, type } = this.props;

        const rootCls = classNames({
            'alert': true,
            'alert-info': type == TYPE_INFO,
            'alert-success': type == TYPE_SUCCESS,
            'alert-warning': type == TYPE_WARNING,
            'alert-dismissible': true,
            [styles.rootCls]: true,
            'alert-hidden': this.state.hidden
        });

        const labelCls = classNames({
            'label': true,
            'label-info': type == TYPE_INFO,
            'label-success': type == TYPE_SUCCESS,
            'label-warning': type == TYPE_WARNING
        });

        return (
            <div className={rootCls}>
                <div className="btns">
                    <button type="button" className="btn btn-info"
                        onClick={this.okClickHandle.bind(this)}>
                        确定
                    </button>
                    <button type="button" className="btn btn-info"
                        onClick={this.closeClickHandle.bind(this)}>
                        取消
                    </button>
                </div>
                <span className={labelCls}>{TYPE_TEXTS[type]}</span>
                <span className="msg">{msg}</span>
            </div>
        )
    }

    okClickHandle() {
        const onOk = this.props.onOk;
        onOk && onOk();
    }

    closeClickHandle() {
        const onClose = this.props.onClose;
        onClose && onClose();
    }
}

TopConfirm.defaultProps = {
    type: TYPE_INFO,
    msg: '',
    timestamp: 0
}

TopConfirm.propTypes = {
    type : PropTypes.oneOf([TYPE_INFO, TYPE_SUCCESS, TYPE_WARNING]),
    msg : PropTypes.string,
    timestamp: PropTypes.number,
    onOk: PropTypes.func,
    onClose: PropTypes.func,
}

export default TopConfirm