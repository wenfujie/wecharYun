// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',//标题
    content:'',//内容
  },

  // 取消
  handleCancel(){
    wx.navigateTo(-1);
    // wx.navigateBack({delta:1});
  },

  // 保存
  handleSave(){
    let nullTip = "";
    if(!this.data.title){
      nullTip = "标题";
    } else if (!this.data.content){
      nullTip = "内容";
    }

    if (nullTip){
      wx.showToast({ title: `${nullTip}不能为空！`, icon:'none'});
    }else{
      console.log("开始调用保存接口")
  // 这里传参有问题
      wx.cloud.callFunction({
        name:'todo',
        data:{title:111, content:1111},
        success:res=>{
          console.log("保存suc")
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