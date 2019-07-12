// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const signinList = db.collection('signinList');
const signinDayList = db.collection('signinDayList');

// 云函数入口函数
exports.main = async (e, context) => {
  let { OPENID, APPID } = cloud.getWXContext();
  try {
    let list = await signinList.where({
      _openid: OPENID
    }).get();
    list = list.data;
    for (let i = 0; i < list.length; i++){
      list[i].total = await signinDayList.where({
        _signinProjectId: list[i]._id
      }).count().then((res)=>{
        return res.total;
      });
    }
    
    return list;

  } catch (e) {
    console.error(e)
  }
}