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

// here we assume that there are no escaped
// double quotes inside the style tag value
export function styleAttrToJsx(xml) {
  let rx = / style="([^"]*)"/g;
  let arr = rx.exec(xml);
  if (!arr) return xml;
  return xml.replace(rx, ' style=' + cssToJsxStr(arr[1]));
}

// we assume that the ouput of xml2js is always outputted
// with lower-case and that it uses double quotes for
// all attr values
// Another assumption is that there are no
// escaped double quotes in the attr value
export function attrsToObj(attrs) {
  let o = {};
  // a non whitespace character can be an attr name
  let rx = / (\S+)="/g;
  let elements = [], tmp;
  /* eslint-disable no-cond-assign */
  while (tmp = rx.exec(attrs)) elements.push(tmp[1]);
  /* eslint-enable */

  elements
    .map(function(i) {
      // non double quote character can be an attr value
      let rx2 = new RegExp(` ${i}="([^\"]*)"`, 'g');
      let arr = rx2.exec(attrs);
      o[i] = arr[1];
    });
  return o;
}

export function convertRootToProps(xml) {
  // Note: There is a space after svg, which means that
  // there is at least one attribute defined for the
  // root element. This is safe to assume because, we
  // check if at least width and height are defined for the
  // root svg element
  let rx = /<svg (.*)>/;
  let arr = rx.exec(xml);
  let o = attrsToObj(arr[1]);
  let keys = Object.keys(o);
  keys.map(function(key) {
    if (key === 'style') return;
    o[key] = `{'undefined' === typeof this.props['${key}'] ? ${JSON.stringify(o[key])} : this.props['${key}']}`;
  });
  let proped = keys.map(function(key) {
    return `${key}=${o[key]}`;
  }).join(' ');
  return xml.replace(arr[1], proped);
}

export function hyphenToCamel(name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
