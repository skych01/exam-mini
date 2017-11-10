// pages/test/test.js
const app = getApp(), api = require('../../utils/common.js');
Page({
    thisResult: [], //存放当前题目的答案
    result: [],//存放所有题目答案
    /**
     * 页面的初始数据
     */
    data: {
        index: 1,
        num: 0,
        lastX: 0,
        lastY: 0,
        timeDown: '30:00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.dataInit();
    },

    dataInit: function () {
        var that = this;
        wx.showNavigationBarLoading();
        api.getRequest("/mini/testStart", {}, function (res) {
            var questionList = res.data.content;
            that.setData({
                num: questionList.length,
                questions: questionList,
            })
            this.timeDown();
            wx.hideNavigationBarLoading();
        })
    },

    /**
     *  页面的滑动效果  
     * 通过滑动的初始位置和结束位置判断滑动方向
     */
    start: function (event) {
        this.data.lastX = event.changedTouches[0].pageX;
        this.data.lastY = event.changedTouches[0].pageY;
    },
    end: function (event) {
        let currentX = event.changedTouches[0].pageX
        if ((currentX - this.data.lastX) < 0) {
            console.log("right")
            this.next();
        }
        else if (((currentX - this.data.lastX) > 0)) {
            console.log("left");
            this.last();
        }
    },
    /** 滑动 end  */

    //上一题
    last: function () {
        var that = this;
        var index = that.data.index - 1;

        //不是第一题
        if (index > 0) {
            that.teggerIng();
            that.saveResult();
            setTimeout(function () {
                that.setData({
                    index: index,
                })
            }, 500);
        }
    },

    //下一题
    next: function () {
        var that = this;
        var index = that.data.index + 1;
        //不是最后一题
        if (index <= that.data.num) {
            that.teggerIng();
            that.saveResult();
            setTimeout(function () {
                that.setData({
                    index: index,
                })
            }, 500);

        }
    },

    //试题切换效果
    teggerIng: function () {
        var animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease",
            delay: 0
        })
        animation.opacity(0).step();
        animation.opacity(1).step();
        this.setData({
            animationData: animation.export(),
        })
    },

    //倒计时
    timeDown: function () {
        var that = this;
        var x = 30,
            interval;
        var d = new Date("1111/1/1,0:" + x + ":0");
        interval = setInterval(function () {
            var m = d.getMinutes();
            var s = d.getSeconds();
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            that.setData({
                timeDown: m + ":" + s
            })
            if (m == 0 && s == 0) {
                clearInterval(interval);
                wx.showModal({
                    title: '时间到！',
                    content: '本次测试已提交，点击确认查看结果',
                    success: function (res) {
                        if (res.confirm) {
                            
                        }else{

                        }
                    }
                })
                return;
            }
            d.setSeconds(s - 1);
        }, 1000);
    },

    //收藏
    collection: function () {

    },

    //提交试卷
    submit: function () {
        this.saveResult();
        api.getRequest("/mini/submitAnswer", { data: this.result }, function (res) {
            wx.hideNavigationBarLoading();
        })
    },

    //存放result
    saveResult: function () {
        //this.result = this.result.concat(this.thisResult);
        this.result.push(this.thisResult);
    },

    //选择答案
    setAnswer: function (e) {
        var that = this;
        var AllItem = this.data.questions[this.data.index - 1].answer, item = e.detail.value;
        that.thisResult = { questionId: this.data.questions[this.data.index - 1].questionId,answer:[]}
        for (var i = 0, lenI = AllItem.length; i < lenI; ++i) {
            AllItem[i].checked = false;
            for (var j = 0, lenJ = item.length; j < lenJ; ++j) {
                if (AllItem[i].answerId == item[j]) {
                    AllItem[i].checked = true;
                    that.thisResult.answer.push(item[j]);
                    break;
                }
            }
        }

        this.data.questions[this.data.index - 1].answer = AllItem;
        this.setData({
            questions: this.data.questions
        });
        //selEmployee = employee
    },


})
