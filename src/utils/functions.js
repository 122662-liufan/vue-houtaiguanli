export const formatDate = (num) => {
  var now = new Date(Number(num * 1000));
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//如果记得时间戳是毫秒级的就需要*1000 不然就错了记得转换成整型
// var d = new Date(1230999938);
// alert(formatDate(d))