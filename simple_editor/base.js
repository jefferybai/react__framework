import React, { Component } from 'react'

class EditorBase extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isEditing: false,
			sourceCode: props.value
		}

		this.handleBodyClick = this.handleBodyClick.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value) {
			this.setState({
				sourceCode: nextProps.value
			})
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleBodyClick)
	}

	render() {
		return null
	}

	handleBodyClick(e) {
		if (e.target == this.refs.editor) {
			return
		}

		this.submitEdit()
		document.removeEventListener('click', this.handleBodyClick)
	}

	submitEdit() {
		const { onChange } = this.props
		this.setState({
			isEditing: false
		})
		onChange && onChange(this.state.sourceCode)
	}

	sourceCodeChangeHandle(e) {
		this.setState({
			sourceCode: e.target.value
		})
	}

	editorKeyDownHandle(e) {
	}

	monitorClickHandle() {
		this.setState({
			isEditing: true
		})
		document.removeEventListener('click', this.handleBodyClick)
		document.addEventListener('click', this.handleBodyClick)
	}
}

EditorBase.defaultProps = {
	className: '',
	placeholder: '点击修改',
	value: ''
}

export default EditorBase