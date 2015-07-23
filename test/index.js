// run other tests
import './deep-filter';
import './parsers';

// test for index.js
import test from 'tape';
import sinon from 'sinon';
import loader from '../src/index';

// I don't know why,
// but babel must be require-d
var babel = require('babel');

let svgSource = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M30,1h40l29,29v40l-29,29h-40l-29-29v-40z" stroke="#000" fill="none"/>
  <path d="M31,3h38l28,28v38l-28,28h-38l-28-28v-38z" fill="#a23"/>
  <text x="50" y="68" font-size="48" fill="#FFF" text-anchor="middle"><![CDATA[410]]></text>
</svg>
`;

test('test loader output', function(t) {
  t.plan(5);
  let loaderContext = {
    cacheable: sinon.spy(),
    addDependency: sinon.spy(),
    async: function() {
      return function(err, result) {
        t.ok(err === null, 'no compilation errors occurred');
        t.ok(result, 'result exists');
        let res = babel.transform(result);
        t.ok(typeof res === 'object', 'babel transformation test');
      };
    }
  };
  loader.apply(loaderContext, [svgSource]);
  t.ok(loaderContext.addDependency.called, 'loader adds dependency');
  t.ok(loaderContext.cacheable.called, 'loader cached');
});
