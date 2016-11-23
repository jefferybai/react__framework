import React, { Component } from 'react'
import EditorBase from './base'
import tplRender from './input.jsx'

class InputEditor extends EditorBase {
	render() {
		return tplRender.bind(this)()
	}

	editorKeyDownHandle(e) {
		const { height } = this.state
		if(e.keyCode != 13) {
			return
		}
		const _this=this
		setTimeout(function(){
			_this.submitEdit()
		},0)
	}
}

export default InputEditor