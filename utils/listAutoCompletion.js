import moment from 'moment'
import forEachRight from 'lodash/forEachRight'

/**
 * 自动智能补全监控数据， 用以填充图表
 * @example listAutoCompletion([], 'timestamp')(startDate, endDate)(1, 'd')
 * @param {array} list 监控数组
 * @param {string} [timeKey=timestamp] 数据对象中，表示时间的属性名
 * @param {date} startDate 开始时间
 * @param {date} endDate 结束时间
 * @param {number} [interval=1] 每条数据之间的时间间隔, 默认1
 * @param {string} [unit='h'] 每条数据之间的时间间隔的单位, 默认h, 小时
 * @param {} [callback] 填充每条数据时的回调函数，可通过此函数添加一些自定义的填充数据。回调函数格式(newItem: Object)
 */
export default function listAutoCompletion(list, timeKey = "timestamp") {
    var listMap = {}
    forEachRight(list, item => listMap[item[timeKey]] = item)

    return function(startDate, endDate) {
        let startMoment = moment(startDate)
        let endMoment = moment(endDate)

        if (!startMoment.isValid() || !endMoment.isValid()) {
            throw new Error("startDate and endDate must be Date Object")
        }

        let min = moment.min(startMoment, endMoment)
        if (min != startMoment) {
            endMoment = startMoment
            startMoment = min
        }

        return function(interval = 1, unit = 'h', callback) {
            let tmpMoment = startMoment.clone()
            let tmpMomentVal = tmpMoment.valueOf()
            let endMomentVal = endMoment.valueOf()
            let newlist = []

            while (tmpMomentVal < endMomentVal) {
                let newItem = listMap[tmpMomentVal] || { [timeKey]: tmpMomentVal }
                newlist.push(newItem)
                tmpMomentVal = tmpMoment.add(interval, unit).valueOf()
                callback&&callback(newItem)
            }

            return newlist;
        }
    }
}