// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const todoList = db.collection('todoList');

// 云函数入口函数
exports.main = async (e, context) => {
  try {
    let { OPENID, APPID } = cloud.getWXContext();
    return await todoList.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: e.title,
        createTime: db.serverDate(),
        done: e.done,
        _openId: OPENID,
        doneTime:''
      },
    })
  } catch (e) {
    console.error(e)
  }
}