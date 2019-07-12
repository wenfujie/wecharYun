//index.js
const app = getApp()
const util = require("../../../util.js");
const currentDate = new Date();//当前日期
Page({
  data: {
    year: "2018",
    month:"1",
    date:"",// 选中日期
    daysColor: [],// 设置日期颜色
    stringDate:"",//选中日期
    canSignin: true,//false表示所选天已打过卡
    currentItem: {},//当前对象 
    show:false,//图片弹出层
    selectImgSrc:'',//选中放大图得id
  },

  // 显示图片弹层
  handleShowPopum(e){
    this.setData({selectImgSrc: e.currentTarget.dataset.src},()=>{
      wx.nextTick(()=>{
        this.setData({
          show: true
        });
      })
    });
  },
  
  // 蒙层关闭
  onClose(){
    this.setData({ show: false });
  },

  // 前往打卡信息填写页
  toSigninPage(){
    // if (!this.data.canSignin){
    //   wx.showToast({
    //     title: '今天已打卡~',
    //     icon: 'none'
    //   })
    //   return;
    // }
    if (!this.data.date){
      wx.showToast({
        title: '请选择要打卡日期~',
        icon: 'none'
      })
      return;
    }
    let _id = this.data.currentItem._id ? this.data.currentItem._id : '';

    wx.navigateTo({
      url: '/pages/signin/addSigninDay/addSigninDay?signinDate=' +
       this.data.stringDate +
        '&signinProjectId=' + this.data.signinProjectId +
        '&_id=' + _id
    })
  },

  // 获取签到天数列表
  getSigninDayList(){

    let curYear = this.data.year;
    let curMonth = this.data.month;

    let minDate = new Date(curYear, curMonth - 1, 1);// 当前选中日期1号
    let maxDate = new Date(curYear, curMonth - 1, util.getDayCountOfMonth(curYear, curMonth - 1));// 当前选中日期最后一号

    //用来排序
    var compare = function (item1, item2) {
      return item1.seq - item2.seq;
    }

    app.toastLoading();
    wx.cloud.callFunction({
      name: 'getSigninDayList',
      data: {
        _signinProjectId: this.data.signinProjectId,
        minDate: minDate.getTime(),
        maxDate: maxDate.getTime()
      },
      success: res => {
        let dayList = res.result;
        if (dayList.length > 0) {

          dayList.forEach((item) => {
            if (Array.isArray(item.signinImg)) {
              item.signinImg.sort(compare)
            }
            let date = new Date(item.signinDate).getDate();
            this.data.daysColor.push(util.extend({
              month: 'current',
              day: date,
              color: '#ffffff',
              background: '#00a3e7'
            }, item));
          })

        } else {
          this.data.daysColor = [];
        }

        // 设置当天样式
        if (curYear == currentDate.getFullYear() && curMonth == currentDate.getMonth() + 1) {
          this.data.daysColor.unshift({
            month: 'current',
            day: currentDate.getDate(),
            color: '#FF6EB4'
          });
        }
        wx.nextTick(()=>{
          this.setData({ daysColor: this.data.daysColor });
        })
        app.toastLoading(false);
      }
    })
  },

  // 更新当天日期状态
  updateCurrentDay(){
    this.setData({ 
      year: currentDate.getFullYear(),
      month: currentDate.getMonth()+1,
      stringDate: util.formatDateStr(currentDate)
    });
  },
  
  onLoad: function(params) {
    console.log(params.signinProjectId,"=====")
    this.data.signinProjectId = params.signinProjectId;
    this.updateCurrentDay();
  },
  onShow(){
    this.setData({ 
      daysColor: [],
      currentItem: {}
      });
    this.getSigninDayList();
  },

  // 切换日期
  changeDate(e){
    let params = e.detail;
    this.setData({
      year: params.currentYear,
      month: params.currentMonth,
      daysColor:[],
      currentItem:{}
    });
    this.getSigninDayList();
  },

  // 点击号数
  dayClick(e){
    let allArr = this.data.daysColor;
    let currentItem = {};
    for (let i = 0; i <= allArr.length;i++){
      if (allArr[i] && allArr[i].selected) {
        allArr.splice(i, 1);
      }
      //判断点击天 是否打卡
      if (allArr[i] && (allArr[i].day == e.detail.day)){
        currentItem = allArr[i];
      }
    }
    //更改选中色
    this.data.daysColor.push({
      month: 'current',
      day: e.detail.day,
      color: '#00a3e7',
      selected:true
    });
    // stringDate设置 是为了测试
    this.setData({
      currentItem: currentItem,
      daysColor: this.data.daysColor,
      stringDate: util.formatDateStr(new Date(e.detail.year, e.detail.month-1,e.detail.day)),
      date: e.detail.day
    })
  }

})
