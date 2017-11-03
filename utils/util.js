//年月日时分秒
function format(str) {
    if (!str) return null;
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMinutes = oDate.getMinutes(),
        oSecond = oDate.getSeconds(),
        weekDay = oDate.getDay(),
        oTime = oYear + '-' + formatNumber(oMonth) + '-' + formatNumber(oDay) + ' ' + formatNumber(oHour) + ':' + formatNumber(oMinutes) + ':' + formatNumber(oSecond);
    return oTime;
}
//年月日
function formatDate(str) {
    if (!str) return null;
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oTime = oYear + '-' + formatNumber(oMonth) + '-' + formatNumber(oDay);
    return oTime;
}
//时分秒
function formatTime(str) {
    if (!str) return null;
    var oDate = new Date(str),
        oHour = oDate.getHours(),
        oMinutes = oDate.getMinutes(),
        oSecond = oDate.getSeconds(),
        weekDay = oDate.getDay(),
        oTime = formatNumber(oHour) + ':' + formatNumber(oMinutes) + ':' + formatNumber(oSecond);
    return oTime;
}

//正整数
function isPInt(str) {
    var g = /^[1-9]*[1-9][0-9]*$/;
    return g.test(str);
}
//整数
function isInt(str) {
    var g = /^-?\d+$/;
    return g.test(str);
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function vailData(data, rule) {
    //非空验证
    var required = function (msg) {
        if (!data) {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: false,
            })
            return false;
        }
    }
    //数字
    var isNumber = function (msg) {
        var re = /^-?[0-9]+\.?[0-9]*$/;
        if (!re.test(data)) {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: false,
            })
            return false;
        }
    }
    //大于0的数字
    var isNumberZreo = function (msg) {
        var re = /^[1-9]+\.?[0-9]*$/;
        if (!re.test(data)) {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: false,
            })
            return false;
        }
    }
    //整数
    var isInt = function (msg) {
        var re = /^-?\d+$/;
        if (!re.test(data)) {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: false,
            })
            return false;
        }
    }
    //大于0的整数
    var isIntZreo = function (msg) {
        var re = /^[1-9]+[0-9]*$/;
        if (!re.test(data)) {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: false,
            })
            return false;
        }
    }
    for (var v in rule) {
        switch (v) {
            case '1':
                required(rule[v]);
                break;
            case '2':
                isNumber(rule[v]);
                break;
            case '3':
                isInt(rule[v]);
                break;
            case '4':
                isNumberZreo(rule[v]);
                break;
            case '5':
                isIntZreo(rule[v]);
                break;
            default:
                console.error("类型有误");
                console.error("1:非空验证，2:数字，3：整数，4：大于0数字，5：大于0整数");
        }
    }

}

module.exports = {
    // 拼接日期 以 年月日 
    getMyDate: format,
    formatDate: formatDate,
    formatTime: formatTime,
    isInt: isInt,
    isPInt: isPInt,
    vailData: vailData
}

