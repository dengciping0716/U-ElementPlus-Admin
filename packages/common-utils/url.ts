// 根据name获取单个参数
function getQueryString(name: string) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = (window.location.hash || window.location.search).substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export { getQueryString };

// 截取url的search/hash
function queryString() {
  var target;
  target = window.location.href.split('?');
  target = target.length === 2 ? target[1] : '';
  if (target === '') return {};
  var tArr = target.split('&');
  var tJson = {};
  for (var i = 0, len = tArr.length; i < len; i++) {
    var tmp = tArr[i].split('=');
    tJson[tmp[0]] = decodeURIComponent(tmp[1]);
  }
  return tJson;
}
export { queryString };
