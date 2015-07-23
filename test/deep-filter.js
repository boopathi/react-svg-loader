import test from 'tape';
import filter from '../src/deep-filter';
import clone from 'lodash.clonedeep';

let source = {
  a: {
    b: [
      { c: 'c' },
      { d: 'd' }
    ],
    e: { f: 'f' }
  }
};

test('filter - current key test', function(t) {
  t.plan(1);
  let res = filter(source, function(v, k, p, pk) {
    if (k === 'c') return false;
    return true;
  });
  let expected = clone(source);
  delete expected.a.b[0].c;
  t.deepEqual(res, expected);
});

test('filter - current value test', function(t) {
  t.plan(1);
  let res = filter(source, function(v, k, p, pk) {
    if (v === 'c') return false;
    return true;
  });
  let expected = clone(source);
  delete expected.a.b[0].c;
  t.deepEqual(res, expected);
});

test('filter - parent key test', function(t) {
  t.plan(2);
  let res = filter(source, function(v, k, p, pk) {
    if (pk === 'e') {
      // current key should be f
      t.equal(k, 'f');
      return false;
    }
    return true;
  });
  let expected = clone(source);
  delete expected.a.e.f;
  t.deepEqual(res, expected);
});

test('filter - parent test', function(t) {
  t.plan(1);
  let ref = source.a.b;
  let res = filter(source, function(v, k, p, pk) {
    if (p === ref) return false;
    return true;
  });
  let expected = clone(source);
  expected.a.b = [];
  t.deepEqual(res, expected);
});
