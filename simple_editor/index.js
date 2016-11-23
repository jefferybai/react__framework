import React, { Component } from 'react'
import * as InputTypes from './InputTypes'
import InputEditor from './input'
import TextareaEditor from './textarea'

class SimpleEditor extends Component {
	render() {
		const { props } = this
		const { type } = props
		const otherProps = Object.assign({}, props)
		delete otherProps.type
		switch(type) {
			case InputTypes.INPUT_TYPE_TEXTAREA:
				return <TextareaEditor ref='inner' {...otherProps} />
			case InputTypes.INPUT_TYPE_TEXT:
			default:
				return <InputEditor ref='inner' {...otherProps} />
		}
	}
}

SimpleEditor.defaultProps = {
	type: InputTypes.INPUT_TYPE_TEXT
}

export default SimpleEditor