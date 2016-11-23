import React from 'react'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Echarts from './index'

/*
 * 饼图
 * @example
 * <EchartsPie
		chartTitle="某站点用户访问来源"
		data={[
			{value:335, name:'直接访问'},
			{value:310, name:'邮件营销'},
			{value:234, name:'联盟广告'},
			{value:135, name:'视频广告'},
			{value:1548, name:'搜索引擎'}
		]}/>
 */
class EchartsPie extends Echarts {

    _setOption(props) {
        let option = this._getDefaultOption(props)

        this._translateOption(option, props)

        this.chart.setOption(option, true)
        this.chart.hideLoading()
    }

    _getDefaultOption(props) {
        return {
            title: {
                text: '',
                left: 'center',
                top: 1,
                padding: 20,
                itemGap: 0
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 0,
                data: []
            },
            series: []
        }
    }

    _translateOption(option, props) {
        option.series.push({
            name: '',
            type: 'pie',
            center: ['50%', '50%'],
            data: [].concat(props.data)
        })
        let { chartTitle } = props
        option.title.text = chartTitle

        if (chartTitle) {
            option.series[0].radius = '50%'
            option.series[0].center = ['50%', '55%']
        }

        props.data.forEach(item => {
            if (!!props.legend) {
                option.legend.data.push(item.name)
            }
        })

        let totalValue = 0
        props.data.forEach(item => totalValue = totalValue + item.value)
        if (totalValue == 0) {
            option.tooltip.show = false
            option.tooltip.showContent = false
            option.series[0].center = ['50%', '55%']
            option.series[0].radius = ['35%', '65%']
            option.series[0].data = [{
                value: 1,
                name: '暂无数据填充',
                hoverAnimation: false,
                tooltip: {
                    show: false
                },
                label: {
                    normal: {
                        show: true,
                        formatter: '暂无数据',
                        position: 'center',
                        textStyle: {
                            color: 'rgb(0,0,0)',
                            fontSize: 16,
                            baseline: 'middle'
                        }
                    },
                    emphasis: {
                        formatter: '暂无数据',
                        textStyle: {
                            color: 'rgb(0,0,0)',
                            fontSize: 16,
                            baseline: 'middle'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(200,200,200,0.3)'
                    },
                    emphasis: {
                        color: 'rgba(200,200,200,0.3)'
                    }
                }
            }]
        }
    }
}

EchartsPie.defaultProps = Object.assign({}, Echarts.defaultProps, {
    chartTitle: "",
    data: []
})

export default EchartsPie