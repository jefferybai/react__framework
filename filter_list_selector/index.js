import React, { Component, PropTypes } from 'react'
import tplRender from './index.jsx'

function defaultDisplayTextFormatter(item) {
    let type = typeof item
    switch (type) {
        case 'string':
            return item

        case 'object':
            return item[this.props.dataKey||Object.keys(item)[0]]

        default:
            return type
    }
}

function defaultFilter(item, i, keyword) {
    return this.props.displayTextFormatter.call(this, item).toLowerCase().indexOf(keyword) != -1
}

class FilterListSelector extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filterKeyword: '',
            selectedItem: null
        }

        this.lastSelectedItem = null
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            let { filterKeyword } = this.state
            let { data } = nextProps

            this.filterList(data, filterKeyword)
        }
    }

    componentDidMount() {
        this.filterList(this.props.data, this.state.filterKeyword)
    }

    componentWillUnmount() {
        clearTimeout(this.willAutoSelectTimer)
    }

    render() {
        return tplRender.bind(this)()
    }

    filterList(data, filterKeyword) {
        let { filter } = this.props
        let keyword = filterKeyword.toLowerCase()
        let filteredList = data.filter((item, i) => filter.call(this, item, i, keyword))
        this.setState({ filteredList })
        return filteredList
    }

    filterInputChange(e) {
        let { data, onSelect } = this.props
        let val = e.target.value
        this.setState({
            filterKeyword: val
        })
        let filteredList = this.filterList(data, val)
        clearTimeout(this.willAutoSelectTimer)
        this.willAutoSelectTimer = setTimeout(() => this.selectItem(val == '' ? null : filteredList[0]), 150)
    }

    selectItem(item) {
        let { onSelect } = this.props
        if (this.lastSelectedItem != item) {
            this.lastSelectedItem = item
            this.setState({
                selectedItem: item
            })
            onSelect && onSelect(item)
        }
    }

    itemOnclickHandle(item) {
        let { displayTextFormatter } = this.props
        if (this.lastSelectedItem != item) {
            this.setState({
                filterKeyword: displayTextFormatter.call(this, item)
            })
            this.selectItem(item)
        }
    }
}

FilterListSelector.defaultProps = {
    data: [],
    placeholder: '输入关键字过滤',
    filter: defaultFilter,
    displayTextFormatter: defaultDisplayTextFormatter
}

FilterListSelector.propTypes = {
    data: PropTypes.array,
    placeholder: PropTypes.string,
    filter: PropTypes.func,
    displayTextFormatter: PropTypes.func
}

export default FilterListSelector