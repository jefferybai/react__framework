import React, { Component, PropTypes } from 'react'
import tplRender from './index.jsx'

/*
 * 分页组件
 * @props {number} pageIndex 当前页码数
 * @props {number} maxPageNum 总计页码数
 * @props {number} pageSize 每页显示页码数的个数, 当总页码数过大时使用
 * @example
    <Pager pageIndex={1} maxPageNum={9} pageSize={7} />
 */
class Pager extends Component {
    constructor(props) {
        super(props)

        this.state = {
			inputPageIndex: props.pageIndex,
            pageIndex: props.pageIndex
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageIndex != this.props.pageIndex) {
            this.setState({
                pageIndex: nextProps.pageIndex
            })
        }
    }

    render() {
        return tplRender.call(this)
    }

    pageIndexClickHandle(pageIndex) {
        const { pageIndexOnChange } = this.props
        this.setState({ pageIndex })
        pageIndexOnChange && pageIndexOnChange(pageIndex || 1)
    }

    pageIndexInputChangeHandle(e) {
        let val = e.target.value
        this.setState({
            inputPageIndex: parseInt(e.target.value) || 1
        })
    }

    btnGotoPageClickHandle() {
        const { pageIndexOnChange } = this.props
        const { inputPageIndex } = this.state
        this.setState({
            pageIndex: inputPageIndex||1
        })
        pageIndexOnChange && pageIndexOnChange(inputPageIndex||1)
    }
}

Pager.defaultProps = {
    className: '',
    pageIndex: 1,
    pageSize: 7,
    maxPages: 0
}

Pager.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    maxPages: PropTypes.number,
    pageIndexOnChange: PropTypes.func
}

export default Pager