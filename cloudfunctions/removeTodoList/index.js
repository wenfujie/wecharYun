// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (e, context) => {
  try {
    const tasks = [];

    for (let i = 0; i < e.ids.length; i++) {
      const promise = db.collection('todoList').doc(e.ids[i]).remove()
      tasks.push(promise);
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: {},
        errMsg: "操作成功",
      }
    })
  } catch (e) {
    console.error(e)
  }
}