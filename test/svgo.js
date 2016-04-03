import {validateAndFix} from '../src/svgo';
import test from 'tape';

test('fill is false and plugins is empty', function(t) {
  let opts = {};
  validateAndFix(opts);
  t.equal(typeof opts.plugins, 'undefined');
  t.end();
});

test('fills essential plugins when empty', function(t) {
  let opts = {
    full: true
  };
  validateAndFix(opts);
  t.equal(opts.plugins.length, 2);
  t.notEqual(opts.plugins.indexOf('removeDoctype'), -1);
  t.notEqual(opts.plugins.indexOf('removeComments'), -1);
  t.end();
});

test('enable disabled essential plugins', function(t) {
  let opts = {
    full: true,
    plugins: [ 'removeDoctype', {removeComments: false} ]
  };
  validateAndFix(opts);
  t.equal(opts.plugins.length, 2);
  t.equal(opts.plugins[1].removeComments, true);
  t.end();
});
