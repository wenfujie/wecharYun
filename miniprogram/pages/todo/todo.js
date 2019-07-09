import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,//
    value:"",//输入框值
    showTodoList: true,//是否展示待办事项
    showDoneList:true,//是否展示完成事项
    doneList: [],//完成事项列表
    doingList:[],//待办事项列表
    doingCount: 0,//待办选中个数
    doneCount:0,//完成选中个数
    state:{//控制按钮状态
      toAdd:false,
      toDone:false,
      toDoing: false,
      removeDone: false,
      removeDoing:false,
    }
  },

  //点击完成
  handleDone(e){
    let arr = e.currentTarget.dataset.arr;
    let idStr = [];
    let type = e.currentTarget.dataset.type;


    arr.forEach((item,index)=>{
      // 绑到复选框value 完成事项用check（自定义），待办用done
      if (type === "done"){//完成
        if (item.check) {
          idStr.push(item._id);
        }
        if(index==0){
          this.setData({ 'state.toDoing': true });          
        }
      }else{//待办
        if (item.done) {
          idStr.push(item._id);
        }
        if (index == 0) {
          this.setData({ 'state.toDone': true });
        }
      }
      
    })
    const db = wx.cloud.database()
    console.log(type === "done" ? '' : db.serverDate(),"999")
    wx.cloud.callFunction({
      name:'updateTodoList',
      data:{
        ids: idStr,
        value: type === "done"?false:true
      },
      success:(res)=>{
        if (type === "done") {
          this.setData({ 'state.toDoing': false });          
        }else{
          this.setData({ 'state.toDone': false });
        }
        this.getTodoList();        
      }
    })
  },

  //点击删除
  removeTodoList(e) {
    let arr = e.currentTarget.dataset.arr;
    let idStr = [];
    let type = e.currentTarget.dataset.type;


    arr.forEach((item, index) => {
      // 绑到复选框value 完成事项用check（自定义），待办用done
      if (type === "done") {//完成
        if (item.check) {
          idStr.push(item._id);
        }
      } else {//待办
        if (item.done) {
          idStr.push(item._id);
        }
      }

    })
    wx.showModal({
      title: '提示',
      content: '确认删除选中事项？',
      success:res=>{
        if (res.confirm){
          if (type === "done") {
            this.setData({ 'state.removeDone': true });
          } else {
            this.setData({ 'state.removeDoing': true });
          }
          wx.cloud.callFunction({
            name: 'removeTodoList',
            data: {
              ids: idStr
            },
            success: (res) => {
              console.log("删除成功", res)
              if (type === "done") {
                this.setData({ 'state.removeDone': false });
              } else {
                this.setData({ 'state.removeDoing': false });
              }
              this.getTodoList();
            }
          })
        }
      }
    })
  },

  //添加待办 
  addTodoItem(e){
    if (!this.data.value){
      Toast("请输入待办事项内容");
      return;
    }
    this.setData({'state.toAdd':true});

    wx.cloud.callFunction({
      name: 'todoList',
      data: {
        done:false,
        title:this.data.value
      },
      success: res => {
        this.setData({value:""});
        this.getTodoList();
        Toast("添加成功~");
        this.setData({ 'state.toAdd': false });        
      }
    })
    
  },

  //切换折叠状态
  handleShowTodoList(e){
    if(e.currentTarget.dataset.type == "todo"){
      this.setData({ showTodoList: !this.data.showTodoList});
    }else{
      this.setData({ showDoneList: !this.data.showDoneList });      
    }
  },

  // 点击复选框
  onclickBox(e){
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let boo = false;

    if (type === "doing"){
      boo = !this.data.doingList[index].done;
      if(boo){
        this.data.doingCount++;
      }else{
        this.data.doingCount--;        
      }
      this.setData({ [`doingList[${index}].done`]: boo, doingCount: this.data.doingCount});
    }else{
      boo = !this.data.doneList[index].check;            
      if (boo) {
        this.data.doneCount++;
      } else {
        this.data.doneCount--;
      }
      this.setData({ [`doneList[${index}].check`]: boo, doneCount: this.data.doneCount});
    }
    console.log(this.data.doingCount, this.data.doneCount)
  },

  //输入框值变化
  onInputChange(event) {
    // event.detail 为当前输入的值
    this.setData({ value: event.detail});
  },

  //获取待办事项列表
  getTodoList(callback){
    let that = this;
    wx.cloud.callFunction({
      name:"getTodoList",
      data:{},
      success:res=>{
        let obj = { done: [], doing: [] };
        res.result.data.forEach(item=>{         
          if (item.done) {
            item.check = false;
            obj.done.push(item);
          } else {
            obj.doing.push(item);
          }
        })
        that.setData({
          doneList:obj.done,doingList:obj.doing,
          doingCount:0,
          doneCount:0
          });
        typeof callback === "function" && callback();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTodoList();
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
    let callback = ()=>{
      wx.stopPullDownRefresh();
    }
    this.getTodoList(callback);
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