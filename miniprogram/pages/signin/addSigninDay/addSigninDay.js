const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',//内容
    beginDate: '2016-09-01',//开始时间
    imagePathList:[],//已选中图片列表
  },

  // 上传图片
  doUpload: function () {
    console.log(app.globalData,123)
    // 选择图片
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {

        // wx.showLoading({
        //   title: '上传中',
        // })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = app.globalData.imgPath + (+new Date())+ filePath.match(/\.[^.]+?$/)[0];
        this.setData({ imagePathList: res.tempFilePaths });
        
        return 
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 选择时间
  bindDateChange(e) {
    console.log(e.detail.value,11)
    this.setData({
      beginDate: e.detail.value
    })
  },

  // 取消
  handleCancel() {
    wx.navigateBack({ delta: 1 });
  },

  // 保存
  handleSave() {
    let nullTip = "";
    if (!this.data.content) {
      nullTip = "内容";
    } else if (!this.data.beginDate) {
      nullTip = "打卡时间";
    }

    if (nullTip) {
      wx.showToast({ title: `'${nullTip}' 不能为空！`, icon: 'none' });
    } else {

      // 数据增加操作
      wx.cloud.callFunction({
        name: 'addSigninDay',
        data: {
          "signinDate": this.data.beginDate,
          "signinImg": '123',
          "signinDescribe": this.data.content,
          "_signinProjectId": this.data.signinProjectId,
        },
        success: res => {
          console.log(res, 123)
          wx.showToast({ title: "保存成功！", icon: 'success' });
          wx.navigateBack({
            delta:1
          })
        }
      })
    }
  },

  // input值变化事件
  changeTitle(e) {
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
    this.setData({
      beginDate: options.signinDate,
      signinProjectId: options.signinProjectId
    })
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