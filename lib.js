var fs = require('fs')
var getbytes = (hexstring = "", returnarg = true) => {
	if(returnarg) {
		return [hexstring.match(/.{2}/g), hexstring];
	} else return hexstring.match(/.{2}/g);
}
var mergebytes = (bytearray = []) => {
	var info = {
		bytestring: "",
		bytebuffer: null
	}
	info.bytestring = bytearray.join("")
	info.bytebuffer = new Buffer.from(info.bytestring, 'hex')
	return info
}
var isnan = (str) => {
	var temp = `${str}`
	if(temp === "undefined" || temp === "null" || temp === "NaN") {
		return true
	} else return false
}
module.exports = {
    getbytes: getbytes,
    isnan: isnan,
    mergebytes: mergebytes
}