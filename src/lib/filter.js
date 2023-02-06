import Vue from 'vue'

Vue.filter('dateFormat', function (timestamp) {
  if (!timestamp) {
    return ''
  }
  var today = new Date(timestamp)

  //日期
  var DD = String(today.getDate()).padStart(2, '0') // 获取日
  var MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
  var yyyy = today.getFullYear() // 获取年

  // 时间
  let hh = String(today.getHours()).padStart(2, '0') //获取当前小时数(0-23)
  let mm = String(today.getMinutes()).padStart(2, '0') //获取当前分钟数(0-59)
  let ss = String(today.getSeconds()).padStart(2, '0') //获取当前秒数(0-59)
  return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
})
