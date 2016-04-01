import Svgo from 'svgo';
import {transform as babelTransform} from 'babel-core';

import plugin from './plugin';

const svgo = new Svgo();

export function optimize (content) {
  return new Promise(r => svgo.optimize(content, ({data}) => r(data)));
}

export function transform (content) {
  return babelTransform(content, {
    presets: ['react'],
    plugins: [plugin]
  });
}

export default function (content) {

  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  let cb = this.async();

  Promise.resolve(String(content))
    .then(optimize)
    .then(transform)
    .then(result => {
      cb(null, result.code);
    })
    .catch(err => {
      cb(err);
    });
}
