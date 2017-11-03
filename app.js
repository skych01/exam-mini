//app.js
App({
    onLaunch: function () {
        var that = this;
        that.validAuthentication();
    },

    /**
     * 获取 authentication
     */
    onLogin: function (callback, callbackPram) {
        var that = this;
        //同时只允许登录一次
        if (that.globalData.isLoginPass) {
            that.globalData.isLoginPass = false;
            //网络请求信息
            var serverInfo = that.globalData.ServiceInfo;
            wx.login({
                fail: res => {
                    that.globalData.isLoginPass = true;
                    console.log('调用wxAPI login失败！ info:' + res);
                },
                success: (loginRes) => {
                    wx.getUserInfo({
                        fail: res => {
                            wx.showModal({
                                title: '',
                                content: '请授权公共信息',
                                showCancel: false
                            });
                            console.log('调用wxAPI getUserInfo失败！info:' + res);
                            that.globalData.isLoginPass = true;
                        },
                        success: (getUserRes) => {
                            wx.showToast({
                                title: '登录中...',
                                icon: 'loading',
                                mask: true
                            });
                            wx.request({
                                url: serverInfo.protocol + serverInfo.domin_name + serverInfo.pathContext + serverInfo.onLoginPath,
                                data: {
                                    code: loginRes.code,
                                    encryptedData: getUserRes.encryptedData,
                                    iv: getUserRes.iv
                                },
                                fail: (e) => {
                                    wx.showModal({
                                        title: '',
                                        content: '连接失败，请确认网络环境',
                                        showCancel: false
                                    });
                                    console.log('访问不到服务器！ info:');
                                    console.log(e)
                                },
                                complete: () => {
                                    that.globalData.isLoginPass = true;
                                    wx.hideToast();
                                },
                                success: res => {
                                    //登录成功
                                    if (res.data.success) {
                                        //将 证书放进本地缓存
                                        wx.setStorageSync('authentication', res.data.content);
                                        //获取用户信息存进全局变量 
                                        that.globalData.userInfo = getUserRes.userInfo;
                                        //执行回调函数
                                        if (typeof fn == 'function') callback(callbackPram);
                                        console.log('登录成功！authentication:' + wx.getStorageSync('authentication'));
                                    } else {
                                        wx.showModal({
                                            title: '',
                                            content: '登录失败，请联系管理员',
                                            showCancel: false
                                        });
                                        console.log('authentication无法获取！服务器内部错误 info:' + res.data.message);
                                    }
                                }
                            })
                        },
                    })
                }
            })
        }
    },

    /**
    * 验证 本地session，服务器token 是否正常。过期登录
    */
    validAuthentication:function ()  {
        var that = this;
        //调用API从本地缓存中获取数据
        var authentication = wx.getStorageSync('authentication');
        //获取不到session 进行登录
        if (authentication == null || authentication == '') {
            console.log('本地authentication为空，重新获取');
           // that.onLogin(that.getRoleInfo);
            that.onLogin();
        } else {
            wx.checkSession({
                success: res => {
                    console.log('authentication正常 登录状态保持中 authentication：' + authentication);
                    wx.getUserInfo({
                        success: function (getUserRes) {
                            that.globalData.userInfo = getUserRes.userInfo;
                        }
                    });
                    //that.getRoleInfo();
                },
                //获取到session已过期 进行登录
                fail: () => {
                   // that.onLogin(that.getRoleInfo);
                    that.onLogin();
                }
            })
        }
    },

    //全局对象 用于存放全局变量
    globalData: {
        userInfo: null,
        ServiceInfo: require('utils/data.js').configuration_info(),
        isRead: false,
        isLoginPass: true,
        roles: [],
    },

})