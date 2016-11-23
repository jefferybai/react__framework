import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import throttle from 'lodash/throttle'
import defaultTheme from './theme'

/*
* Echarts图表组件基类
    <Echarts
        option={{
            xAxis : [
                {
                    type : 'category',
                    data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    boundaryGap : [0, 0.01]
                }
            ],
            series : [
                {
                    name:'2011年',
                    type:'bar',
                    data:[18203, 23489, 29034, 104970, 131744, 630230]
                }
            ]
        }}/>
*/
class Echarts extends Component {
    constructor(props) {
        super(props)

        this.resizeChart = throttle( () => this.chart.resize(), 16)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.option != this.props.option){
            this._setOption(nextProps)
        }
    }

    componentDidMount() {
        this._initChart()
        this._setOption(this.props)
        window.addEventListener("resize", this.resizeChart)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeChart)
        this._destroyChart()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        const { className, style } = this.props
        return (<div className={className} style={style}></div>)
    }

    _initChart() {
        this.chart = echarts.init(findDOMNode(this), this.props.theme||defaultTheme)
    }

    _setOption(props) {
        this.chart.setOption(props.option, true)
        this.chart.hideLoading()
    }

    _destroyChart() {
        this.chart.dispose()
        this.chart = null
    }
}

Echarts.defaultProps = {
    className: "",
    option: {}
}

Echarts.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
}

export default Echarts