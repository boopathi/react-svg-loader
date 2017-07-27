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
    if (opts.jsx) {
      babelOpts = {
        babelrc: false,
        plugins: [
          'syntax-jsx',
          [plugin, {
            styleProp: opts.styleProp,
          }],
        ],
      };
    } else {
      babelOpts = {
        babelrc: false,
        presets: ['react'],
        plugins: [
          plugin,
          [plugin, {
            styleProp: opts.styleProp,
          }],
        ],
      };
    }
    return babelTransform(content, babelOpts);
  }
}

export default function (content) {
  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  const query = loaderUtils.getOptions(this) || {};

  let cb = this.async();

  Promise.resolve(String(content))
    .then(optimize(query.svgo))
    .then(transform({
      jsx: query.jsx,
      styleProp: query.styleProp
    }))
    .then(result => {
      cb(null, result.code);
    })
    .catch(err => {
      cb(err);
    });
}
