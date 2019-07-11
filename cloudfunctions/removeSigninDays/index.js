// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const signinDayList = db.collection('signinDayList');

// 云函数入口函数
exports.main = async (e, context) => {
  let { OPENID, APPID } = cloud.getWXContext();
  try {
    let list = await signinDayList.where({
      _signinProjectId: e._signinProjectId
    }).remove();
    return list;
  } catch (e) {
    console.error(e)
  }
}