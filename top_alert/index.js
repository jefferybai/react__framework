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

class TopAlert extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hidden: true	
		};
		this.oldValue = props.type+props.msg+props.timestamp;
	}

	componentWillReceiveProps(nextProps) {
		let { msg, type, timestamp } = nextProps;
		if( type+msg+timestamp != this.oldValue ) {
			this.setState({hidden:false})
			this.timer = setTimeout(this.closeClickHandle.bind(this), 3000)
			this.oldValue = type+msg+timestamp;
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
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
				<button type="button" className="close"
					onClick={this.closeClickHandle.bind(this)}>
					<span aria-hidden="true">&times;</span>
				</button>
				<span className={labelCls}>{TYPE_TEXTS[type]}</span>
				<span className="msg">{msg}</span>
			</div>
		)
	}

	closeClickHandle() {
		clearTimeout(this.timer)
		this.setState({hidden:true})
	}
}

TopAlert.defaultProps = {
	type: TYPE_INFO,
	msg: '',
	timestamp: 0
}

TopAlert.propTypes = {
	type : PropTypes.oneOf([TYPE_INFO, TYPE_SUCCESS, TYPE_WARNING]),
	msg : PropTypes.string,
	timestamp: PropTypes.number
}

export default TopAlert