// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const signinDayListCollection = db.collection('signinDayList');

// 云函数入口函数
exports.main = async (e, context) => {
  try {
    let { OPENID, APPID } = cloud.getWXContext();
    return await signinDayListCollection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        "signinDate": e.signinDate,
        "createdDate": db.serverDate(),
        "signinImg": e.signinImg,
        "signinDescribe": e.signinDescribe,
        "signinDateStamp": e.signinDateStamp,
        "_openid": OPENID,
        "_signinProjectId": e._signinProjectId,
      },
    })
  } catch (e) {
    console.error(e)
  }
}