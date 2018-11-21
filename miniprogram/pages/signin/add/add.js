
const util = require("../../../util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',//标题
    content:'',//内容
    beginDate: util.formatDateStr(new Date()),//开始时间
  },

  // 选择时间
  bindDateChange(e){
    this.setData({
      beginDate: e.detail.value
    })
  },

  // 取消
  handleCancel(){
    wx.navigateBack({delta:1});
  },

  // 保存
  handleSave(){
    let nullTip = "";
    if(!this.data.title){
      nullTip = "标题";
    } else if (!this.data.content){
      nullTip = "内容";
    } else if (!this.data.beginDate){
      nullTip = "开始时间";      
    }

    if (nullTip){
      wx.showToast({ title: `'${nullTip}' 不能为空！`, icon:'none'});
    }else{

      // 数据增加操作
      wx.cloud.callFunction({
        name: 'signinList',
        data: {
          "signinBeginDate": this.data.beginDate,
          "signinDescribe": this.data.content,
          "signinName": this.data.title
        },
        success: res => {
          wx.showToast({ title: "保存成功！", icon: 'success' });
          wx.navigateBack({ delta: 1 });
        }
      })
    }
  },

  // input值变化事件
  changeTitle(e){
    this.setData({
      title: e.detail.value
    });
  },

  // textarea值变化事件
  changeContent(e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})