// @flow

import Svgo from "svgo";
import { transform as babelTransform } from "babel-core";
import loaderUtils from "loader-utils";

import { validateAndFix } from "./svgo";
import plugin from "./plugin";

export default function(content: string) {
  const loaderOpts = loaderUtils.getOptions(this) || {};

  const cb = this.async();

  Promise.resolve(String(content))
    .then(optimize(loaderOpts.svgo))
    .then(transform())
    .then(result => cb(null, result.code))
    .catch(err => cb(err));
}

// SVGO Optimize
function optimize(opts = {}) {
  validateAndFix(opts);
  const svgo = new Svgo(opts);

  return content =>
    new Promise((resolve, reject) =>
      svgo.optimize(
        content,
        ({ error, data }) => (error ? reject(error) : resolve(data))
      )
    );
}

// Babel Transform
function transform() {
  return content =>
    babelTransform(content, {
      babelrc: false,
      plugins: ["syntax-jsx", plugin]
    });
}
