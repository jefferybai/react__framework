import React from 'react'
import marked from './marked'
import styles from './style.less'

function getDisplayText() {
	const { sourceCode } = this.state
	const { placeholder } = this.props

	return {
		__html: sourceCode?marked(sourceCode||''):placeholder
	}
}

export default function render() {
	const { isEditing, sourceCode, height } = this.state;
	const { className, style } = this.props;

	return (
		<div className={styles.rootCls + ' ' + className} style={style}>
			{isEditing?
				<textarea ref='editor' className='form-control editor'
					value={sourceCode}
					onChange={this.sourceCodeChangeHandle.bind(this)}
					onKeyDown={this.editorKeyDownHandle.bind(this)}
					autoFocus
					style={{height:height}}/>:
				<div ref='monitor' className='form-control monitor'
					dangerouslySetInnerHTML={getDisplayText.bind(this)()}
					onClick={this.monitorClickHandle.bind(this)}></div>}
		</div>
	)
}