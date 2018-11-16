let util = {};

/**
 * 使用：util.formatDateStr(new Date()) //或时间戳
 * 返回：1999-01-01
 */
util.formatDateStr = function(paramDate){
  let date = new Date(paramDate);
  return [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
}

//得到该月有几天（传入年份如1999，月份如11--传月份要减1）
util.getDayCountOfMonth = function(year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }
  if (month === 1) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }
  return 31;
}

// 合并对象
util.extend  =  function (destination, source) {
  for  (var  property  in  source) {
    destination[property]  =  source[property];
  }
  return  destination;
}

module.exports = util;