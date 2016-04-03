import test from 'tape';
import {execFile} from 'child_process';
import path from 'path';

Error.stackTraceLimit = Infinity;

function exec (...args) {
  return new Promise((resolve, reject) => {
    execFile('node', [path.join(__dirname, '..', 'lib', 'cli.js'), '-0'].concat(args), {
      cwd: path.join(__dirname, 'resources')
    }, function(err, stdout, stderr) {
      if (err) {
        /* eslint-disable no-console */
        console.error(stderr);
        /* eslint-enable */
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

function occurence(content) {
  let occ = {};
  occ.import = content.match(/import\sReact/g);
  occ.export = content.match(/export\sdefault/g);
  occ.import = occ.import ? occ.import.length : 0;
  occ.export = occ.export ? occ.export.length : 0;
  return occ;
}

function testOccurence(t, content, n) {
  let o = occurence(content);
  t.equal(o.import, n);
  t.equal(o.export, n);
}

test('accept single argument', function(t) {
  exec('dummy.svg')
    .then(r => {
      testOccurence(t, r, 1);
      t.end();
    })
    .catch(t.end);
});

test('accept multiple arguments', function(t) {
  exec('dummy.svg', 'dummy2.svg')
    .then(r => {
      testOccurence(t, r, 2);
      t.end();
    })
    .catch(t.end);
});

test('es5 output', function (t) {
  exec('dummy.svg', '--es5')
    .then(r => {
      testOccurence(t, r, 0);
      t.end();
    })
    .catch(t.end);
});

test('pass options to svgo', function(t) {
  Promise.all([
    exec('dummy.svg'),
    exec('dummy.svg', '--svgo.js2svg.pretty'),
    exec('dummy2.svg', '--svgo.floatPrecision', '1'),
    exec('dummy2.svg', '--svgo.floatPrecision', '8')
  ]).then(r => {
    t.notEqual(r[0], r[1]);
    t.notEqual(r[2], r[3]);
    t.end();
  }).catch(t.end);
});

test('plugins options in svgo', function(t) {
  Promise.all([
    exec('dummy.svg'),
    exec('dummy.svg', '--svgo.full')
  ]).then(r => {
    t.notEqual(r[0], r[1]);
    t.end();
  }).catch(t.end);
});

test('accepts yaml/json/js input', function(t) {
  Promise.all([
    exec('dummy.svg', '--svgo', 'config.yaml'),
    exec('dummy.svg', '--svgo', 'config.json'),
    exec('dummy.svg', '--svgo', 'config.js')
  ]).then(r => {
    t.equal(r[0], r[1]);
    t.equal(r[1], r[2]);
    t.end();
  }).catch(t.end);
});
