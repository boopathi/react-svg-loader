import test from 'tape';
import * as parsers from '../src/parsers';

let css = {
  test1: `width: 50px; height: 50px;`,
  test2: `border-radius: 10px 0 0 10px; font-family: Roboto Light`,
  test3: `background: url(https://img.server.tld/blahblah)`
};

let styles = {
  test1: `<svg style="${css.test1}">`,
  test2: `<g style="${css.test2}">`,
  test3: `<svg style="${css.test3}">`
};

let cssResults = {
  test1: { width: '50px', height: '50px' },
  test2: { 'border-radius': '10px 0 0 10px', 'font-family': 'Roboto Light'},
  test3: { background: 'url(https://img.server.tld/blahblah)' }
};

let jsxResults = {
  test1: `{${JSON.stringify(cssResults.test1)}}`,
  test2: `{${JSON.stringify(cssResults.test2)}}`,
  test3: `{${JSON.stringify(cssResults.test3)}}`
};

let stylesResults = {
  test1: `<svg style=${jsxResults.test1}>`,
  test2: `<g style=${jsxResults.test2}>`,
  test3: `<svg style=${jsxResults.test3}>`
};

test('parsing a css string to object', function (t) {
  t.plan(3);
  Object.keys(css).map(function(key) {
    t.deepEqual(parsers.cssToObject(css[key]), cssResults[key]);
  });
});

test('parsing a css string to jsx style tag value', function(t) {
  t.plan(3);
  Object.keys(css).map(function(key) {
    t.equal(parsers.cssToJsxStr(css[key]), jsxResults[key]);
  });
});

test('parsing xml and convert style attrs to jsx', function(t) {
  t.plan(3);
  Object.keys(styles).map(function(key) {
    t.equal(parsers.styleAttrToJsx(styles[key]), stylesResults[key]);
  });
});

let attrs = {
  test1: ` width="600" height="600" id="svg2" version="1.0"`
};

let tags = {
  test1: `<svg${attrs.test1}>`
};

let attrsResults = {
  test1: {width: '600', height: '600', id: 'svg2', version: '1.0'}
};

let tagsResults = {
  test1: `<svg height={'undefined' === typeof this.props['height'] ? 600 : this.props['height']} id={'undefined' === typeof this.props['id'] ? svg2 : this.props['id']} version={'undefined' === typeof this.props['version'] ? 1.0 : this.props['version']}>`
};

test('parse tag attributes to object', function(t) {
  t.plan(1);
  Object.keys(attrs).map(function(key) {
    t.deepEqual(parsers.attrsToObj(attrs[key]), attrsResults[key])
  });
});

test('convert xml root tag attributes to jsx accepting props from parent', function(t) {
  t.plan(1);
  Object.keys(tags).map(function(key) {
    t.equal(parsers.convertRootToProps(tags[key]), tagsResults[key]);
  });
});
