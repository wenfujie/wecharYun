
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signinList:[],//签到列表
  },

  // 前往签到详情页
  toItemDetailPage(e){
    wx.navigateTo({
      url: '/pages/signin/signinDetail/signinDetail?signinProjectId=' + e.currentTarget.dataset.item._id, 
    })
  },


  // 获取签到列表
  getSigninList(){
    wx.nextTick(()=>{
      app.toastLoading();
      wx.cloud.callFunction({
        name: 'getSigninList',
        data: {
        },
        success: res => {
          this.data.signinList = [];
          let list = res.result;
          this.setData({ signinList: list })
          app.toastLoading(false);
          // 下拉刷新还原
          wx.stopPullDownRefresh();
        }
      })
    })
  },

  // 获取列表条数
  getSigninCount(db, item, resolve){
    db.collection('signinDayList').where({
      _signinProjectId:item._id
    }).count().then(res => {
      // item.total = res.total;
      resolve && resolve(res.total);
      // this.data.signinList.push(item);
      // this.setData({ signinList: this.data.signinList});        
    })
  },

  // 前往添加数据叶
  addSigninItem(){
    wx.navigateTo({
      url: '/pages/signin/add/add',
    })
  },

  // 删除单个数据
  removeSigninItem(e){
    let item = e.currentTarget.dataset.item;    
    wx.showModal({
      title:"提示",
      content:`是否确认删除打卡计划【${item.signinName}】`,
      success:(data)=>{

        if (data.confirm){
          // 删除签到日期子集
          wx.cloud.callFunction({
            name: 'removeSigninDays',
            data: {
              _signinProjectId: item._id
            },
            success: res => {
              // 删除签到项目
              this.data.db.collection("signinList")
                .doc(item._id).remove().then((res) => {
                  this.getSigninList();
                })
            }
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.db = wx.cloud.database();
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
    this.getSigninList();
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
    this.getSigninList();
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