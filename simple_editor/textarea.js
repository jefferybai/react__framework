import React, { Component } from 'react'
import EditorBase from './base'
import tplRender from './textarea.jsx'

class TextareaEditor extends EditorBase {
	render() {
		return tplRender.bind(this)()
	}

	editorKeyDownHandle(e) {
		const { height } = this.state
		if(e.keyCode != 13) {
			return
		}

		this.setState({
			height: height+20
		})
	}

	monitorClickHandle() {
		super.monitorClickHandle()

		this.setState({
			height: this.refs.monitor.offsetHeight
		})
	}
}

export default TextareaEditor