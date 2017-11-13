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
        //设置时长
        timeLength: 1
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
            that.timeDown();
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
        var x = that.data.timeLength,
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
                    showCancel: false,
                    success: function (res) {
                        that.submit();
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

    //提交之前的验证 确认提交
    vaildAndSubmit: function () {
        var that = this;
        if (that.result.length < that.data.questions.length - 1) {
            wx.showModal({
                content: '当前题目尚未答完，确定提交？',
                success: function (res) {
                    if (!res.confirm) {
                        return;
                    } else {
                        that.submit();
                    }
                }
            })
        } else {
            that.submit();
        }
    },
    //提交试卷
    submit: function () {
        var that = this;
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            mask: true
        });
        that.saveResult();
        api.getRequest("/mini/submitAnswer", { data: that.result }, function (res) {
            wx.hideNavigationBarLoading();
            wx.navigateTo({
                url: 'result/result?result=' + JSON.stringify(res.data.content) + '&data=' + JSON.stringify(that.data.questions)
            })
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
        var thisQuestion=this.data.questions[this.data.index - 1]
        var AllItem = thisQuestion.answer, item = e.detail.value;
        that.thisResult = { questionId: this.data.questions[this.data.index - 1].questionId, answer: [] }
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
    },


})
