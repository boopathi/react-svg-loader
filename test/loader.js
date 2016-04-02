import reactSVGLoader from '../src/loader';
import React from 'react';
import testUtils from 'react-addons-test-utils';
import test from 'tape';

function loader(content) {
  return new Promise(function(resolve, reject) {
    let context = {
      query: '?es5=true',
      cacheable() {},
      addDependency() {},
      async() {
        return function(err, result) {
          if (err) return reject(err);

          // there is a bug that
          // vm.runInContext won't work in Node inside Promise (microtask)
          let exports = {};
          let module = { exports };

          // so the ugly eval comes in
          // since we generate the code, I assume safely that it's
          // doing no harm
          eval(`(function(module, exports) { ${result} })(module, exports)`);

          resolve(module.exports.default);
        }
      }
    };
    reactSVGLoader.apply(context, [content]);
  });
}

function render(element) {
  let r = testUtils.createRenderer();
  r.render(element);
  return r.getRenderOutput();
}

test('empty svg tag', function(t) {

  t.plan(1);

  loader(`<svg/>`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(r.type, 'svg');
    })
    .catch(t.end);

});

test('svg tag with some props', function(t) {

  t.plan(4);

  loader(`<svg width="50" height="50" />`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(r.type, 'svg', 'tag check');
      t.assert(Object.keys(r.props).length > 1, 'assert props exists');
      t.equal(r.props.width, '50', 'width prop check');
      t.equal(r.props.height, '50', 'height prop check');
    })
    .catch(t.end);
});

test('passing props to empty svg tag', function(t) {
  t.plan(4);

  loader(`<svg/>`)
    // pass in number - comes out as number,
    // pass in string - comes out as string
    .then(component => render(React.createElement(component, {width: 100, height: '100'})))
    .then(r => {
      t.equal(r.type, 'svg', 'tag check');
      t.assert(Object.keys(r.props).length > 1, 'assert props exists');
      t.equal(r.props.width, 100, 'width prop check');
      t.equal(r.props.height, '100', 'height prop check');
    })
    .catch(t.end);
});

test('overriding props of an svg', function(t) {

  t.plan(4);

  loader(`<svg width="50" height="50" />`)
    .then(component => render(React.createElement(component, {width: 100, height: '100'})))
    .then(r => {
      t.equal(r.type, 'svg', 'tag check');
      t.assert(Object.keys(r.props).length > 1, 'assert props exists');
      t.equal(r.props.width, 100, 'width prop check');
      t.equal(r.props.height, '100', 'height prop check');
    })
    .catch(t.end);

});

test('compression: namespace attr', function(t) {

  t.plan(1);

  loader(`<svg xmlns:bullshit="adsf" />`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(Object.keys(r.props).length, 0, 'namespace props are stripped');
    })
    .catch(t.end);
});
