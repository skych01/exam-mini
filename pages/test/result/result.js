const app = getApp(), api = require('../../../utils/common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

        points: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var data = JSON.parse(options.data);
        var result = JSON.parse(options.result);


        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < result.correctId.length; j++) {
                if (data[i].questionId == result.correctId[j]) {
                    data[i].isCorrect = true;
                }
            }
        }
        console.log(data)
        this.setData({
            username: app.globalData.userInfo.nickName,
            list: data,
            points:result.points
        })
        this.DataInit();

    },


})