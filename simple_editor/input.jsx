import React from 'react'
import styles from './style.less'

export default function render() {
	const { isEditing, sourceCode } = this.state
	const { className, style, placeholder } = this.props

	return (
		<div className={styles.rootCls + ' ' + className} style={style}>
			{isEditing?
				<input ref='editor' className='form-control editor'
					value={sourceCode}
					onChange={this.sourceCodeChangeHandle.bind(this)}
					onKeyDown={this.editorKeyDownHandle.bind(this)}
					autoFocus />:
				<div ref='monitor' className='form-control monitor'
					onClick={this.monitorClickHandle.bind(this)}>
					{sourceCode||placeholder}
				</div>}
		</div>
	)
}