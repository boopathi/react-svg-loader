import Svgo from 'svgo';
import {transform as babelTransform} from 'babel-core';
import loaderUtils from 'loader-utils';

import {validateAndFix} from './svgo';
import plugin from './plugin';

function optimize (opts) {
  validateAndFix(opts);
  const svgo = new Svgo(opts);
  return function (content) {
    return new Promise((resolve, reject) =>
      svgo.optimize(content, ({error, data}) => error ? reject(error) : resolve(data))
    );
  };
}

function transform (opts) {
  return function(content) {
    let babelOpts;
    if (opts.es5) {
      babelOpts = {
        babelrc: false,
        presets: ['es2015-loose', 'react'],
        plugins: [plugin]
      };
    } else {
      babelOpts = {
        plugins: ['syntax-jsx', plugin]
      };
    }
    return babelTransform(content, babelOpts);
  }
}

export default function (content) {

  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  const query = loaderUtils.parseQuery(this.query);

  let cb = this.async();

  Promise.resolve(String(content))
    .then(optimize(query.svgo))
    // .then(r => (console.log(r), r))
    .then(transform({
      es5: query.es5
    }))
    .then(result => {
      cb(null, result.code);
    })
    .catch(err => {
      cb(err);
    });
}
