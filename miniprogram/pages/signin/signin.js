// pages/signin/signin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signinList:[],//签到列表
  },

  // 前往签到详情页
  toItemDetailPage(e){
    console.log(e.currentTarget.dataset.item._id)
    wx.navigateTo({
      url: '/pages/signin/signinDetail/signinDetail?signinProjectId=' + e.currentTarget.dataset.item._id, 
    })
  },


  // 获取签到列表
  getSigninList(){
    const db = wx.cloud.database();
    db.collection('signinList').where({
      _openid: "oQJOK5UkB9EdJmRJmTvd8DQaHtPo"
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        this.data.signinList = [];
        if(res.data.length > 0){
          let pJson = {};          
          res.data.forEach((item,index) => {
            pJson[index] = new Promise((resolve)=>{
              this.getSigninCount(db, item, resolve);
            })
            pJson[index].then((data)=>{
              item.total = data;
              console.log("asdasda", data, item)              
              this.data.signinList.push(item);
              this.setData({ signinList: this.data.signinList });               
            })
          })
        }
      }
    })
  },

  // 获取列表条数
  getSigninCount(db, item, resolve){
    db.collection('signinDayList').where({
      _signinProjectId:item._id
    }).count().then(res => {
      console.log(res.total,123)
      // item.total = res.total;
      resolve && resolve(res.total);
      // console.log(res.total, item)      
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
          this.data.db.collection("signinList")
            .doc(item._id).remove().then((res) => {
              wx.showToast({
                title: '删除成功！',
              })
              this.getSigninList();
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