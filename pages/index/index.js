//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        testTime:0,
        maxPoints:0
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        var that = this, initTime = 0;
        if (!app.globalData.isRead) {
            //限制20次访问 （10秒）
            if (initTime <= 20) {
                setTimeout(that.onLoad, 500);
                console.log(initTime++);
                return;
            } else {
                wx.hideToast();
                wx.showModal({
                    title: '登录时间过长！',
                    content: '是否重新登录',
                    success: function (res) {
                        if (res.confirm) {
                            app.onLogin(that.onLoad);
                        }
                    }
                })
                console.log("isRead 长时间为false");
            }
        } else {
            that.setData({
                userInfo: app.globalData.userInfo
            })
        }
    },

})
