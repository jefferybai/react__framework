import React, { Component } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

class TopProgress extends Component {
	constructor(props) {
		super(props);

		this.state = {
			completed: props.value||0,
			hidden: false
		};
		this.oldValue = props.value;
	}

	componentWillReceiveProps(nextProps) {
		let { value } = nextProps;
		if( value != this.oldValue ) {
			if (!value) {
				NProgress.start();
			} else {
				NProgress.set(value);
			}
			this.oldValue = value;
		}
	}

	componentDidMount() {
		NProgress.start();
	}

	componentWillUnmount() {
		NProgress.remove();
	}

	render() {
		return ( <div /> )
	}
}

export default TopProgress