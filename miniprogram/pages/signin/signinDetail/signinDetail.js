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
    canSignin: true,//打卡按钮状态
    currentItem: {},//当前对象
  },

  // 前往打卡信息填写页
  toSigninPage(){
    if (!this.data.canSignin){
      wx.showToast({
        title: '今天已打卡~',
        icon: 'none'
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/signin/addSigninDay/addSigninDay?signinDate=' + this.data.stringDate + '&signinProjectId=' + this.data.signinProjectId,
    })
  },

  // 获取签到天数列表
  getSigninDayList(){
    let curYear = this.data.year;
    let curMonth = this.data.month;

    let minDate = new Date(curYear, curMonth - 1, 1);// 当前选中日期1号
    let maxDate = new Date(curYear, curMonth - 1, util.getDayCountOfMonth(curYear, curMonth - 1));// 当前选中日期最后一号

    // 根据this.data.signinProjectId获取已签到数据
    const db = wx.cloud.database();
    const _ = db.command;    
    db.collection('signinDayList').where({
      _signinProjectId: this.data.signinProjectId,
      createdDate: _.gte(minDate).and(_.lte(maxDate))
    }).limit(10).get({
      success: res => {
        let dayList = res.data;
        if (dayList.length > 0){

          dayList.forEach((item) => {
            let date = item.signinDate.substring(8, 10);
            // 设置打卡按钮状态
            if (date == currentDate.getDate()) {
              this.setData({ canSignin: false });
            }
            this.data.daysColor.push(util.extend({
              month: 'current',
              day: date,
              color: '#fff',
              background: '#000'
            },item));
          })

        }else{
          this.data.daysColor = [];
        }
        
        if (this.data.canSignin && curYear == currentDate.getFullYear() && curMonth == currentDate.getMonth()+1){
          this.data.daysColor.unshift({
            month: 'current',
            day: currentDate.getDate(),
            color: '#fff',
            background: '#f5a8f0'
          });
        }
        this.setData({ daysColor: this.data.daysColor });
        console.log(this.data.daysColor)
        
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

  dayClick(e){
    let allArr = this.data.daysColor;
    let currentItem = {};
    for (let i = 0; i <= allArr.length;i++){
      //判断点击天 是否打卡
      if (allArr[i] && (allArr[i].day == e.detail.day)){
        currentItem = allArr[i];
      }
      if (allArr[i] && allArr[i].selected){
        allArr.splice(i,1);
      }
    }
    //更改选中色
    this.data.daysColor.push({
      month: 'current',
      day: e.detail.day,
      color: '#00a3e7',
      selected:true
    });

    console.log(currentItem,"选中数据")
    // stringDate设置 是为了测试
    this.setData({
      currentItem: currentItem,
      daysColor: this.data.daysColor,
      stringDate: util.formatDateStr(new Date(e.detail.year, e.detail.month-1,e.detail.day))
    })
  }

})
