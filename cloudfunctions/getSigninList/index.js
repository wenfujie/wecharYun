// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const signinList = db.collection('signinList');

// 云函数入口函数
exports.main = async (e, context) => {
  let { OPENID, APPID } = cloud.getWXContext();
  try {
    let list = await signinList.where({
      _openid: OPENID
    }).get();
    return list;
  } catch (e) {
    console.error(e)
  }
}