/**
    指标格式化
    @param {string} type 格式化类型
        number_k           数字转换，使用k,m表示
        number_thousand    数字转换，千分位表示法
        time               转换时间，使用ms、s、m、h表示，输入单位是us
        time_ms            转换时间，以毫秒表示，不带单位。输入单位是us
        time_h             转换时间，以小时表示，不带单位。输入单位是s
        flow               转换流量，使用KB、MB、GB、TB表示，输入单位是byte
        flow_mb            转换流量，总是以MB显示
        flow_kb            转换流量，总是以KB显示
    @example APM.util.indicatorFormatter("number_k")(32432);
*/
function isNone(value) {
	return value == null || value == undefined || value == '-';
}

function flowFormatter(val) {
	if(isNone(val)){
		return "-";
	}
	if (val < 1024) {
		return val + "B";
	} else if (val < 1048576){
		return (val/1024).toFixed(2) + "KB";
	} else if (val < 1073741824){
		return  (val/1048576).toFixed(2) + "M";
	} else if (val < 1099511627776){
		return  (val/1073741824).toFixed(2) + "G";
	} else if (val < 1125899906842624){
		return (val/1099511627776).toFixed(2) + "T";
	} else{
		return (val/1125899906842624).toFixed(2) + "P";
	}
}

function indicatorFormatter(type) {
	switch(type){
		case "number_k":
			return function(val){
				if(isNone(val)){
					return "-";
				}
				val = parseInt(val, 10);
				if(val>999999){
					return (val/1000000).toFixed(0)+"m";
				}
				if(val>9999){
					return (val/1000).toFixed(0)+"k";
				}
				return val;
			}
		case "number_thousand":
			return function(val){
				var reg=/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g;
				return isNone(val)?"-":String(val).replace(reg, '$&,');
			}
		case "time":
			return function(val){
				if(isNone(val)){
					return "-";
				}
				val = parseInt(val, 10);
				if (val < 2000) {
					return (val/1000).toFixed(3) + "ms";
				} else if (val < 1000000) {
					return (val/1000).toFixed(0) + "ms";
				} else if (val < 60000000){
					return (val/1000000).toFixed(0) + "s";
				} else if (val < 3600000000){
					return  (val/60000000).toFixed(0) + "m";
				} else {
					return  (val/3600000000).toFixed(0) + "h";
				}
			}
		case "time_h":
			return function(val){
				if(isNaN(val)){
					return NaN;
				}
				val = parseInt(val, 10);
				if (val === 0) {
					return 0;
				} else if (val < 360 && val > -360) {
					return val>0?"<0.1":">-0.1";
				} else {
					return (val/3600).toFixed(1);
				}
			}
		case "flow":
			return flowFormatter;
		case "flow_mb":
			return function(val){
				return  isNone(val)?"-":(val/1048576).toFixed(2);
			}
		case "flow_kb":
			return function(val){
				return  isNone(val)?"-":(val/1024).toFixed(2);
			}
		default:
			return function(val){
				return isNone(val)?"-":val;
			}
	}
}

export default indicatorFormatter