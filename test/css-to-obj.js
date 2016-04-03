import test from 'tape';
import cssToObj from '../src/css-to-obj';

test('no entry check', function(t) {
  let css = '';
  let o = cssToObj(css);
  t.equal(Object.keys(o).length, 0);
  t.end();
});

test('single entry check', function(t) {
  let css = 'text-align: center';
  let o = cssToObj(css);
  t.equal(o['text-align'], 'center');
  t.equal(Object.keys(o).length, 1);
  t.end();
});

test('multiple entries check', function(t) {
  let url = 'https://example.com/image.svg';
  let css = `width: 50px; height: 50px; text-align: center; background:url(${url})`;
  let o = cssToObj(css);
  t.equal(Object.keys(o).length, 4);
  t.equal(o.width, '50px');
  t.equal(o.height, '50px');
  t.equal(o['text-align'], 'center');
  t.equal(o.background, `url(${url})`);
  t.end();
});
