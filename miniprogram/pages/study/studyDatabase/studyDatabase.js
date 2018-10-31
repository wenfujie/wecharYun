// pages/study/studyDatabase/studyDatabase.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult:[]
  },

  // 删除段子
  removeItem(e){
    const id = e.currentTarget.dataset._id;
    wx.showModal({
      title:"提示",
      content: `是否确认删除id为${id}的记录`,
      success: res=>{
        console.log(res)
        if (res.confirm){
          this.data.db.collection("jokes").doc(id).remove({
            success:res=>{
              wx.showToast({
                title:"删除成功！",

              })
              this.getJokeList();
            }
          })
        }
      }
    })
  },

  //  插入段子
  insertJoke(){
    this.data.db.collection('jokes').add({
      data: {
        title:"笑话1",
        check:1,
        text:"等我以后有了小孩子，我会整天逼着他玩手机，然后每天骂他：怎么还不去玩游戏啊？怎么还不去看小说啊？怎么还不去看动漫啊？你特么怎么又在写作业啊！\n然后，他就会以逆反的心理背着我偷偷的看书，偷偷的学习，唯一的乐趣就是和小伙伴一起去上学。每次被我训斥时，他便会略带哭腔可怜巴巴的对我说：爸比，求您了，就让我再写两页作业吧！\n教子新技能，点赞传递正能量。不要谢我，我是红领巾！"
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        this.getJokeList();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  // 获取段子列表
  getJokeList(){
    // 查询当前用户所有的 counters
    this.data.db.collection('jokes').where({
      check: 1
    }).get({
      success: res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
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