export function toObject(css) {
  let o = {};
  let elements = css.split(';');
  elements
    .filter(i => !!i)
    .map(function(i) {
      let s = i.split(':');
      let key = s.shift().trim();
      let value = s.join(':').trim();
      o[key] = value;
    });
  return o;
}

export function toJsxStr(css) {
  let o = toObject(css);
  return `{${JSON.stringify(o)}}`;
}

export function styleAttrToJsx(xml) {
  let rx = / style="([^"]*)"/g;
  let arr = rx.exec(xml);
  return xml.replace(rx, ' style=' + toJsxStr(arr[1]));
}
