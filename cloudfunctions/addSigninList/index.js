// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (e, context) => {
  try {
    let { OPENID, APPID, ENV} = cloud.getWXContext();
    cloud.updateConfig({
      env: ENV
    })
    const db = cloud.database();
    const signinListCollection = db.collection('signinList');
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