#!/usr/bin/env node

import loader from './loader';
import fs from 'fs';
import yargs from 'yargs';
import yaml from 'js-yaml';
import path from 'path';
import isPlainObject from 'lodash.isplainobject';

export function makeFilename(filename) {
  return filename + '.react.js';
}

export function handlePath(configFile) {
  switch (path.extname(configFile)) {
    case '.yaml':
      return yaml.safeLoad(fs.readFileSync(configFile));
    case '.json':
    case '.js':
      return require(path.join(process.cwd(), configFile));
    default:
      throw new Error('Unsupported config file format.');
  }
}

export function getArgv() {
  return yargs
    .usage('Usage: $0 [files] [options]')
    .option('5', {
      alias: 'es5',
      describe: 'Use babel presets es2015 and react',
      boolean: true,
      default: false
    })
    .option('0', {
      alias: 'stdout',
      describe: 'Print output to stdout',
      boolean: true,
      default: 'false'
    })
    // svgo options
    .option('svgo', {
      describe: 'Path to YAML or JS or JSON config file for SVGO'
    })
    .demand(1)
    .version(require('../package.json').version)
    .help('h')
    .alias('h', 'help')
    .argv;
}

export function getSVGOOpts(argv) {
  let svgoOpts;

  if (typeof argv.svgo === 'string') {
    svgoOpts = handlePath(argv.svgo);
  } else if (isPlainObject(argv.svgo)){
    svgoOpts = argv.svgo;
    if (isPlainObject(svgoOpts.plugins) || typeof svgoOpts.plugins === 'string') {
      svgoOpts.plugins = [svgoOpts.plugins];
    }
  }
  return svgoOpts;
}

export function getLoaderContext({argv, query, file}) {
  return {
    query,
    cacheable() {},
    addDependency() {},
    async() {
      return function(err, result) {
        /* eslint-disable no-console */
        if (err) return console.error("ERROR ERROR ERROR", file, err.stack);
        if (argv['0']) console.log(result);
        /* eslint-enable */
        else fs.writeFileSync(makeFilename(file), result);
      };
    }
  };
}

export function run() {
  const argv = getArgv();
  const svgoOpts = getSVGOOpts(argv);

  argv._.map(file => {
    let source = fs.readFileSync(file);

    let query;
    try {
      // serializable check
      query = '?' + JSON.stringify({
        es5: argv.es5,
        svgo: svgoOpts
      });
    } catch(e) {
      /* eslint-disable no-console */
      console.error('The options passed are not serializable.');
      /* eslint-enable */
      process.exit(1);
    }
    loader.apply(getLoaderContext({argv, query, file}), [source]);
  });
}

// for testability
if (require.main === module) {
  run();
}
