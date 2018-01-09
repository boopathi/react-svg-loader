// @flow

import fs from 'fs';
import isSvg from 'is-svg';
import loaderUtils from "loader-utils";
import { optimize, transform } from "react-svg-core";

export default function(content: string) {
  const loaderOpts = loaderUtils.getOptions(this) || {};

  if (loaderOpts.match && !loaderOpts.match.test(this._module.issuer.userRequest)) {
    this.callback(null, content);
    return;
  }

  const cb = this.async();

  Promise.resolve(String(content))
    .then(content => {
      if (isSvg(content)) {
        return content;
      }

      return new Promise((resolve, reject) => {
        fs.readFile(this.resourcePath, 'utf-8', function (err, data) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(optimize(loaderOpts.svgo))
    .then(transform({ jsx: loaderOpts.jsx }))
    .then(result => cb(null, result.code))
    .catch(err => cb(err));
}
