import React, {Component} from 'react'
import {Select} from 'antd'
const Option = Select.Option

class SelectPlus extends Component {
    constructor() {
        super()
        this.state = {
            label: '请选择',
            id: ''
        }
    }
    
     setSelectIndex(i, nextProps) {
        const {dataProvider, onChange, labelField} = nextProps ? nextProps: this.props;
        if(dataProvider.length) {
            this.setState({label: labelField ? dataProvider[i][labelField]: dataProvider[i]});
        } else {
            this.setState({label: '请选择', id: ''})
        }
    }
    
    componentWillMount() {
        this.setSelectIndex(0);
    }

    componentWillReceiveProps(nextProps) {
        this.setSelectIndex(nextProps.selectIndex ? nextProps.selectIndex : 0, nextProps);
    }
   

    onSelectChange(value) {
        const {onChange, dataProvider} = this.props;
        const i = parseInt(value);
        this.setSelectIndex(i);
        onChange(dataProvider[i], i);
    }

    render() {
        const {dataProvider, labelField, style, itemRender} = this.props;
        return (
            <Select style={style} value={this.state.label} onChange={this.onSelectChange.bind(this)}>
                {
                    dataProvider.map(
                        (item, i) => (
                            itemRender ? itemRender :
                            <Option key={i} value={i.toString()}>{labelField ? item[labelField]: item.toString()}</Option>
                        )
                    )
                }
            </Select>
        )
    }
}

export default SelectPlus;