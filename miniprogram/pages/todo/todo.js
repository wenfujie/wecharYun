// pages/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,//
    value:"",//输入框值
    showTodoList: true,//是否展示待办事项
    showDoneList:true,//是否展示完成事项
  },

  //切换折叠状态
  handleShowTodoList(e){
    if(e.currentTarget.dataset.type == "todo"){
      this.setData({ showTodoList: !this.data.showTodoList});
    }else{
      this.setData({ showDoneList: !this.data.showDoneList });      
    }
  },

  //切换复选框状态
  onChange(event) {
    this.setData({
      checked: event.detail
    });
  },
  //输入框值变化
  onInputChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
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