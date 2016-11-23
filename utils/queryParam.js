function isFunction(obj){
	typeof obj === "function";
}

export function encodeQueryParam(param = {}){
	var s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = isFunction( value ) ? value() : ( value == null ? "" : value );
			//去掉对参数名的编码
			s[ s.length ] = key + "=" + encodeURIComponent( value );
		};

	if( typeof param === "object"  ) {
		Object.keys(param).forEach(function(key){
			if(param[ key ] != ""){
				add( key, param[ key ] );
			}
		});
	}

	return s.join( "&" );
}

export function decodeQueryParam(searchStr = ""){
	var str = searchStr.indexOf("?") == -1 ? searchStr : searchStr.substr(1),
		arr = str == "" ? [] : str.split("&"),
		param = {};

	arr.forEach(function(val){
		let itemArr = val.split("=");
		param[itemArr[0]] = decodeURIComponent(itemArr[1]);
	});

	return param;
}