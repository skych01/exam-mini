const app = getApp(), api = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
     points:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          username: app.globalData.userInfo.nickName
      })
  },


})