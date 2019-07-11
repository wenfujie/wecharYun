// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const signinListCollection = db.collection('signinList');

exports.main = async (e, context) => {
  try {
    let { OPENID, APPID} = cloud.getWXContext();
    return await signinListCollection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        "signinBeginDate": e.signinBeginDate,
        "signinDescribe": e.signinDescribe,
        "createTime": db.serverDate(),
        "signinName": e.signinName,
        "_openid": OPENID
      },
    })
  } catch (e) {
    console.error(e)
  }
}