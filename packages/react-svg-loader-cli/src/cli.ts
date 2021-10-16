#!/usr/bin/env node

import loader, { Options } from '@lagunovsky/react-svg-loader'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import yargs from 'yargs'
import type * as svgo from 'svgo'

function makeFilename(filename: string) {
  return filename + '.react.js'
}

function getArgv() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require('../package.json').version

  return yargs
    .usage('Usage: $0 [files] [options]')
    .option('jsx', {
      describe: 'Output JSX instead of applying babel-preset-react',
      boolean: true,
      default: false,
    })
    .option('stdout', {
      describe: 'Print output to stdout',
      boolean: true,
      default: false,
    })
    .option('svgo', {
      describe: 'Path to YAML or JS or JSON config file for SVGO',
    })
    .option('componentName', {
      describe: 'Output named component',
      default: undefined,
    })
    .demand(1)
    .version(version)
    .help('h')
    .alias('h', 'help')
    .parseSync()
}

function getSVGOOpts(argv): svgo.OptimizeOptions {
  if (!argv.svgo) {
    return {}
  }

  switch (path.extname(argv.svgo)) {
    case '.yaml':
      return yaml.safeLoad(fs.readFileSync(argv.svgo).toString())
    case '.json':
      return JSON.parse(fs.readFileSync(argv.svgo).toString())
    case '.js':
      return require(path.join(process.cwd(), argv.svgo))
    default:
      throw new Error('Unsupported config file format.')
  }
}

function getLoaderContext({ argv, options, file }) {
  return {
    getOptions: () => options,
    async() {
      return function (err, result) {
        if (err) {
          console.error('REACT-SVG-LOADER ERROR', file, err.stack)
        } else if (argv['stdout']) {
          console.log(result)
        } else {
          fs.writeFileSync(makeFilename(file), result)
        }
      }
    },
  }
}

function run() {
  const argv = getArgv()
  const svgoOpts = getSVGOOpts(argv)

  argv._.map(file => {
    const options: Options = {
      svgo: svgoOpts,
      jsx: argv.jsx,
      componentName: () => argv.componentName,
    }

    loader.apply(getLoaderContext({ argv, options, file }), [fs.readFileSync(file)])
  })
}

if (require.main === module) {
  run()
}
