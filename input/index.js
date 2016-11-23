import React, {Component} from 'react';
import styles from './index.less';

function detectPlaceholder() {
    var el = document.createElement('input');
    return 'placeholder' in el;
}

const isSupportPlaceholder = detectPlaceholder();

class Input extends Component {
    render() {
        const props = Object.assign({}, this.props);
        const { className, style, placeholder } = props;
        if (!isSupportPlaceholder) {
            delete props.className;
            delete props.style;
            delete props.placeholder;
        }

        return (
            isSupportPlaceholder?
                <input {...props} />:
                <div className={styles.rootCls + ' ' + className} style={style}>
                    <input ref="input" {...props} onChange={this.onInputChange.bind(this)}/>
                    <div ref="placeholder" className="placeholder" onClick={this.placeholderMouseDown.bind(this)}>{placeholder}</div>
                </div>
        );
    }

    placeholderMouseDown() {
        this.refs.input.focus();
    }

    onInputChange(e) {
        var val = e.target.value;
        this.refs.placeholder.style.display = val == '' ? 'block' : 'none';
        const { onChange } = this.props;
        onChange && onChange(e);
    }
}

Input.defaultProps = {
    className: '',
    style: null
}

export default Input;