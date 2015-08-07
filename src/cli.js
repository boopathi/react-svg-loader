#!/usr/bin/env node

import loader from './index.js';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

let {argv} = yargs;

function makeFilename(filename) {
  let ext = path.extname(filename);
  let basename = path.basename(filename, ext);
  let dir = path.dirname(filename);
  return path.join(dir, basename + '.react' + ext);
}

argv._.map(file => {
  let source = fs.readFileSync(file);
  let loaderContext = {
    cacheable() {},
    addDependency() {},
    async() {
      return function(err, result) {
        if (err) console.log(file, err);
        else fs.writeFileSync(makeFilename(file), result);
      };
    }
  };
  loader.apply(loaderContext, [source]);
});
