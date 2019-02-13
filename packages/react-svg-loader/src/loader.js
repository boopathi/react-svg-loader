// @flow

import loaderUtils from "loader-utils";
import { optimize, transform } from "react-svg-core";
import type { BabelFileResult } from "@babel/core";

export default function(content: string) {
  const loaderOpts = loaderUtils.getOptions(this) || {};

  const cb = this.async();

  Promise.resolve(String(content))
    .then(optimize(loaderOpts.svgo))
    .then(transform({ jsx: loaderOpts.jsx }))
    .then((result: BabelFileResult) => cb(null, result.code))
    .catch(err => cb(err));
}
