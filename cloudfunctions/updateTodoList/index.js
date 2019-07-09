// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (e, context) => {
  try {
    // 承载所有读操作的 promise 的数组
    const tasks = [];

    for(let i=0;i<e.ids.length;i++){
      const promise = db.collection('todoList').doc(e.ids[i]).update({
        // data 传入需要局部更新的数据
        data: {
          done: e.value,
          doneTime: db.serverDate()
        }
      })
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