// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const todoList = db.collection('todoList');

// 云函数入口函数
exports.main = async (e, context) => {
  let { OPENID, APPID } = cloud.getWXContext();  
  try {
    let list = await todoList.where({
      _openId: OPENID
    }).get();
    return list;
  } catch (e) {
    console.error(e)
  }
}