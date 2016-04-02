#!/usr/bin/env node

import loader from './loader';
import fs from 'fs';
import yargs from 'yargs';

let {argv} = yargs.boolean('es5').boolean('0');

function makeFilename(filename) {
  return filename + '.react.js';
}

argv._.map(file => {
  let source = fs.readFileSync(file);
  let loaderContext = {
    query: `?es5=${argv.es5}`,
    cacheable() {},
    addDependency() {},
    async() {
      return function(err, result) {
        /* eslint-disable no-console */
        if (err) return console.error("ERROR ERROR ERROR \n", file, err.stack);
        if (argv['0']) console.log(result);
        /* eslint-enable */
        else fs.writeFileSync(makeFilename(file), result);
      };
    }
  };
  loader.apply(loaderContext, [source]);
});
