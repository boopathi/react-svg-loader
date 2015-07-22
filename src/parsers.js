export function cssToObject(css) {
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

export function cssToJsxStr(css) {
  let o = cssToObject(css);
  return `{${JSON.stringify(o)}}`;
}

export function styleAttrToJsx(xml) {
  let rx = / style="([^"]*)"/g;
  let arr = rx.exec(xml);
  return xml.replace(rx, ' style=' + cssToJsxStr(arr[1]));
}

export function attrsToObj(attrs) {
  let o = {};
  let elements = attrs.trim().split(/\s/);
  elements
    .filter(i => !!i)
    .map(function(i) {
      let e = i.split('=');
      let key = e.shift().trim();
      let value = e.join('=').trim();
      o[key] = value;
    });
  return o;
}

export function convertRootToProps(xml) {
  let rx = /<svg (.*)>/;
  let arr = rx.exec(xml);
  let o = attrsToObj(arr[1]);
  let keys = Object.keys(o);
  keys.map(function(key) {
    if (key === 'style') return;
    o[key] = `{'undefined' === typeof this.props['${key}'] ? ${o[key]} : this.props['${key}']}`;
  });
  let proped = keys.map(function(key) {
    return `${key}=${o[key]}`;
  }).join(' ');
  return xml.replace(arr[1], proped);
}
