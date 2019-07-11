const app =getApp()
const imgNum = 3;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',//内容
    beginDate: '2016-09-01',//开始时间
    imagePathList:[],//已选中图片列表
    upLoadImgList:[],
    _id: '',// 有值表示为已打卡数据id
  },
  
  // 长按删除图片
  removeImg(e){
    wx.showModal({
      title: '提示',
      content: '是否确认删除图片？',
      success:()=>{
        this.data.imagePathList.splice(e.currentTarget.dataset.index, 1);
        this.setData({ imagePathList: this.data.imagePathList });
      }
    })
  },

  // 上传图片
  doUpload(callback){
    wx.showLoading({
      title: '保存中~',
    })
    let cloudPath = '';
    this.data.successNum = 0;    
    this.data.imagePathList.forEach((item,index)=>{
      cloudPath = app.globalData.imgPath + (+new Date() + index) + item.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath,
        filePath:item,
        success: res => {
          this.data.upLoadImgList.push({
            seq: index+1,
            imgId: res.fileID
          });
          this.data.successNum++;
          
          if (this.data.successNum >= this.data.imagePathList.length){
            wx.hideLoading();
            typeof callback === 'function' && callback();
          }
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
        }
      })
    })

  },

  // 选择图片
  selectedImg: function () {
    let canSelectNum = imgNum - this.data.imagePathList.length;
    if (canSelectNum<=0){
      wx.showToast({
        title: '最多上传3长图片',
        icon:'none'
      })
      return ;
    }
    wx.chooseImage({
      count: canSelectNum,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {
        const filePath = res.tempFilePaths;
        filePath.forEach((item,index)=>{
          this.data.imagePathList.push(res.tempFilePaths[index]);
        })
        this.setData({ imagePathList: this.data.imagePathList });
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 选择时间
  bindDateChange(e) {
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
      return false;
    } 

    let callback = ()=>{
      if(this.data._id){
        this.data.db.collection('signinDayList').doc(this.data._id).update({
          // data 传入需要局部更新的数据
          data: {
            "signinDescribe": this.data.content,
          },
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }else{
        // 数据增加操作
        wx.cloud.callFunction({
          name: 'addSigninDay',
          data: {
            "signinDate": this.data.beginDate,
            "signinImg": this.data.upLoadImgList,
            "signinDescribe": this.data.content,
            "_signinProjectId": this.data.signinProjectId,
          },
          success: res => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
    if (this.data.imagePathList.length>0){
      this.doUpload(callback);    
    }else{
      typeof callback === 'function' && callback();      
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
      signinProjectId: options.signinProjectId,
      _id: options._id,
      db: wx.cloud.database()
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
    // 编辑打卡
    if (this.data._id){
      this.data.db.collection('signinDayList').where({
        _id: this.data._id
      }).get().then((res)=>{
        this.setData({ content: res.data[0].signinDescribe});
      })
    }
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