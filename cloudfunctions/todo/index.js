// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = wx.cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 这里有问题
  db.collection('todo').add({ data: { title: 111, content: 222}});
}