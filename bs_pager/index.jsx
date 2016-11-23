import React from 'react'
import classNames from 'classnames'
import styles from './index.less'

export default function render() {
    const { className, style } = this.props
    const { pageIndex, inputPageIndex } = this.state
    const { pageSize, maxPageNum } = this.props

    let arr = []
    let firstPageNum = Math.max(1, pageIndex - Math.floor(pageSize / 2))
    let lastPageNum = Math.min(maxPageNum, firstPageNum + pageSize - 1)

    if (firstPageNum > 1) {
        arr.push({
            name: '...',
            value: 1
        })
    }

    for (var i = firstPageNum; i <= lastPageNum; i++) {
        arr.push({
            name: i,
            value: i
        })
    }

    if (maxPageNum > lastPageNum) {
        arr.push({
            name: '...',
            value: maxPageNum
        })
    }

    let cls = {
        [styles.rootCls]: true,
        pagination: true
    }

    return (
        <ul className={classNames(cls) + ' ' + className} style={style}>
            {arr.map((item, i) =>
                <li key={i} className={item.value == pageIndex ? 'active' : ''}>
                    <a href="javascript:;" onClick={this.pageIndexClickHandle.bind(this, item.value) }>{item.name}</a>
                </li>
            ) }
            <li className="goto-page">
                <input type="text" maxLength="3"
                    onChange={this.pageIndexInputChangeHandle.bind(this) }
                    value={inputPageIndex}/>
                <button className="btn btn-primary"
                    onClick={this.btnGotoPageClickHandle.bind(this) }>GO</button>
            </li>
        </ul>
    )
}