import React from 'react'
import classNames from 'classnames'
import styles from './style.less'

function renderFilteredList() {
    let { displayTextFormatter } = this.props
    let { filteredList = [], selectedItem } = this.state
    return filteredList.map((item, i) => {
        let itemCls = classNames({
            'list-group-item': true,
            'active': selectedItem == item
        })
        return <a className={itemCls} key={i}
            onClick={e => this.itemOnclickHandle(item)}>{displayTextFormatter.call(this, item, i)}</a>
    })
}

export default function render() {
    const { className, style, placeholder } = this.props
    const { filterKeyword } = this.state

    return (
        <div className={styles.rootCls + ' ' + className} style={style}>
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                onChange={this.filterInputChange.bind(this)}
                value={filterKeyword} />
            <div className="list-group">
                {renderFilteredList.bind(this)()}
            </div>
        </div>
    )
}