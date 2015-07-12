function toObject(css) {
  var o = {};
  var elements = css.split(';');
  elements
    .filter(function(i) { return !!i; })
    .map(function(i) {
      var s = i.split(':');
      var key = s.shift().trim();
      var value = s.join(':').trim();
      o[key] = value;
    });
  return o;
};

function toJsxStr(css) {
  var o = toObject(css);
  return '{' + JSON.stringify(o) + '}';
}

function styleAttrToJsx(xml) {
  var rx = / style="([^"]*)"/g;
  var arr = rx.exec(xml);
  return xml.replace(rx, ' style=' + toJsxStr(arr[1]));
}

exports.toObject = toObject;
exports.toJsxStr = toJsxStr;
exports.styleAttrToJsx = styleAttrToJsx;
