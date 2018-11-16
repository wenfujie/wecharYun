// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const serverDateCollection = db.collection('serverDate');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { OPENID, APPID } = cloud.getWXContext();
    return await serverDateCollection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        "createdDate": db.serverDate(),
        "_openid": OPENID
      },
    })
  } catch (e) {
    console.error(e)
  }
}