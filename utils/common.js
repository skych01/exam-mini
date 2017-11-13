var app = getApp()
//限制重新登录次数
var loginNum = 0
//请求路径
var Server_info = require('data.js').configuration_info();
var ServerPath = Server_info.protocol + Server_info.domin_name
/**
 * 封装的get请求，token过期时 只是重新执行该方法，在同步调用时使用
 */
function getRequest(url, data, fn, parameter) {
    //每次请求获取一次token
    var token = wx.getStorageSync('authentication');
    //开始请求
    wx.request({
        url: ServerPath + url,
        data: data,
        header: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        success: function (res) {
            if (res.statusCode == 200) {
                fn(res);
                loginNum = 0
            } else {
                //重新登录次数不能超过3次
                if (loginNum <= 2) {
                    //存请求参数
                    savaParameter = {
                        url: url,
                        data: data,
                        fn: fn,
                        parameter: parameter
                    }
                    app.onLogin(getLogin2Request);
                    loginNum++
                } else {
                    wx.showModal({
                        title: '连接失败',
                        content: '网络连接失败，请稍后再试',
                    })
                    console.log("恶意访问，服务器内部或页面逻辑有误");
                    loginNum = 0
                }
            }
        },
        fail: function (e) {
            console.log(e);
            wx.hideLoading()
            wx.showModal({
                title: '连接失败',
                content: '网络连接失败，请稍后再试',
            })
        }
    })
}

function postRequest(url, data, fn, parameter) {
    //每次请求获取一次token
    var token = wx.getStorageSync('authentication');
    //开始请求
    wx.request({
        url: ServerPath + url,
        data: data,
        method:"POST",
        header: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
            if (res.statusCode == 200) {
                fn(res);
                loginNum = 0
            } else {
                //重新登录次数不能超过3次
                if (loginNum <= 2) {
                    //存请求参数
                    savaParameter = {
                        url: url,
                        data: data,
                        fn: fn,
                        parameter: parameter
                    }
                    app.onLogin(postLogin2Request);
                    loginNum++
                } else {
                    wx.showModal({
                        title: '连接失败',
                        content: '网络连接失败，请稍后再试',
                    })
                    loginNum = 0
                    console.log(loginNum)

                }
            }
        },
        fail: function () {
            wx.hideLoading()
            wx.showModal({
                title: '连接失败',
                content: '网络连接失败，请稍后再试',
            })
        }
    })
}
/**
 * 封装的get请求，token过期时，回重新执行回调方法
 * 在login里面加了锁，只会登录一次，异步执行多个请求时调用
 */
function getRequestSyn(url, data, fn, backFun, parameter) {
    //每次请求获取一次token
    var token = wx.getStorageSync('authentication');
    //开始请求
    wx.request({
        url: ServerPath + url,
        data: data,
        header: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        success: function (res) {
            if (res.statusCode == 200) {
                fn(res);
                loginNum = 0
            } else {
                //重新登录次数不能超过3次
                if (loginNum <= 2) {
                    app.onLogin(backFun, parameter);
                    loginNum++
                } else {
                    wx.showModal({
                        title: '连接失败',
                        content: '网络连接失败，请稍后再试',
                        success: function () {
                            loginNum = 0
                            console.log(loginNum)
                            return;
                        }
                    })

                }
            }
        },
        fail: function () {
            wx.hideLoading()
            wx.showModal({
                title: '连接失败',
                content: '网络连接失败，请稍后再试',
            })
        }
    })
}

var savaParameter = {};

function getLogin2Request() {
    //重新请求
    getRequest(savaParameter.url, savaParameter.data, savaParameter.fn, savaParameter.parameter)
    //清空请求参数
    savaParameter = {};
    console.log("111111111111111111");
}
function postLogin2Request() {
    postRequest(savaParameter.url, savaParameter.data, savaParameter.fn, savaParameter.parameter)
    savaParameter = {};
}


module.exports = {
    getRequest: getRequest,
    getRequestSyn: getRequestSyn,
    postRequest: postRequest
}

