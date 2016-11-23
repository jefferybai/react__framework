import React from 'react'
import Echarts from './index'

/*
 * Echarts图表常用组件基类，重写_getDefaultOption和_translateOption方法能实现任意类型echarts图表
 */
class CommonBase extends Echarts {
    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            this._setOption(nextProps)
        }
    }

    _setOption(props) {
        let option = this._getDefaultOption(props)

        this._translateOption(option, props)

        this.chart.setOption(option, true)
        this.chart.hideLoading()
    }

    _translateOption(option, props) {
        //更高级的option需求可以重写这个方法
        this._translateSeries(option, props)
        this._translateOther(option, props)
    }

    _getDefaultOption() {
        //需要实现
        return {}
    }

    _translateSeries(option, props) {
        //需要实现
    }

    _translateOther(option, props) {
        //需要实现
    }
}

export default CommonBase