import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import EchartsBase from './base'

/*
 * 常用的x轴为时间或类目，y轴为数值的柱形图组件
 * 此组件不能满足的，请参考此组件，自行扩展此组件或Echarts
 * @example
	<EchartsBar
		chartTitle="未来一周气温变化"
		xLabelKey="timestamp"
		tooltip={false}
		series={[
			{name: "最高气温", dataKey: "max"},
			{name: "最低气温", dataKey: "min"}
		]}
		data={[
			{timestamp: 1448726400000, max: 45, min: 12},
			{timestamp: 1448730000000, max: 42, min: 10},
			{timestamp: 1448733600000, max: 36, min: 5},
			{timestamp: 1448737200000, max: 55, min: 32}
		]}/>
 */
class EchartsBar extends EchartsBase {
    _getDefaultOption(props) {
        let { chartTitle = '' } = props

        return {
            title: {
                text: chartTitle,
                left: 'center',
                padding: 20,
                itemGap: 0
            },
            tooltip: {
                show: !!props.tooltip,
                showContent: !!props.tooltip,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: []
            },
            grid: {
                left: 60,
                right: 50,
                top: chartTitle != '' ? 60 : 20,
                bottom: 40,
                borderWidth: 0
            },
            xAxis: [
                {
                    splitLine: {
                        show: false
                    },
                    data: []
                }
            ],
            yAxis: [
                {
                    name: '',
                    boundaryGap: ['10%', '10%']
                }
            ],
            series: [],
            label: {
                normal: {
                    show: true,
                    position: 'top'
                },
                emphasis: {
                    show: true,
                    position: 'top'
                }
            }
        }
    }

    _translateOption(option, props) {
        //更高级的option需求可以重写这个方法
        this._translateXAxis(option, props)
        this._translateSeries(option, props)
        this._translateOther(option, props)
    }

    _translateXAxis(option, props) {
        let { data = []} = props
        let xAxisData = option.xAxis[0].data = []
        data.forEach(item => xAxisData.push(item[props.xLabelKey]))

        if (xAxisData.length == 0) {
            xAxisData.push('暂无数据')
        }
    }

    _translateSeries(option, props) {
        let { data = [], series = []} = props

        series.forEach(function(serie) {
            let seriesData = []
            option.series.push({
                name: serie.name,
                type: 'bar',
                data: seriesData,
                barMaxWidth: 55
            })

            data.forEach(item => seriesData.push(this._translateSeriesDataItem(item[serie.dataKey])))

            if (seriesData.length == 0) {
                seriesData.push('-')
            }

            if (!!props.legend) {
                option.legend.data.push(serie.name)
            }
        }.bind(this))
    }

    _translateSeriesDataItem(orgiVal) {
        return {
            value: orgiVal == null ? "-" : orgiVal,
            orgiVal,
            label: {
                normal: {
                    position: orgiVal >= 0 ? 'top' : 'bottom'
                },
                emphasis: {
                    position: orgiVal >= 0 ? 'top' : 'bottom'
                }
            }
        }
    }

    _translateOther(option, props) {
        if (option.legend.data.length > 0) {
            option.grid.top = option.grid.top + 30
        }
    }
}

export default EchartsBar