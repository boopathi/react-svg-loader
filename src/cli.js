#!/usr/bin/env node

import loader from './loader';
import fs from 'fs';
import yargs from 'yargs';

let {argv} = yargs;

function makeFilename(filename) {
  return filename + '.react.js';
}

argv._.map(file => {
  let source = fs.readFileSync(file);
  let loaderContext = {
    cacheable() {},
    addDependency() {},
    async() {
      return function(err, result) {
        /* eslint-disable no-console */
        if (err) return console.error("ERROR ERROR ERROR \n", file, err);
        /* eslint-enable */
        else fs.writeFileSync(makeFilename(file), result);
      };
    }
  };
  loader.apply(loaderContext, [source]);
});
