#!/usr/bin/env node

import loader from "react-svg-loader";
import * as fs from "fs";
import yargs from "yargs";
import yaml from "js-yaml";
import * as path from "path";
import isPlainObject from "lodash.isplainobject";

function makeFilename(filename: string) {
  return filename + ".react.js";
}

function handlePath(configFile: string) {
  switch (path.extname(configFile)) {
    case ".yaml":
      return yaml.safeLoad(fs.readFileSync(configFile).toString());
    case ".json":
      return JSON.parse(fs.readFileSync(configFile).toString());
    case ".js":
      return require(path.join(process.cwd(), configFile));
    default:
      throw new Error("Unsupported config file format.");
  }
}

function getArgv() {
  return (
    yargs
      .usage("Usage: $0 [files] [options]")
      .option("jsx", {
        describe: "Output JSX instead of applying babel-preset-react",
        boolean: true,
        default: false,
      })
      .option("stdout", {
        describe: "Print output to stdout",
        boolean: true,
        default: false,
      })
      // svgo options
      .option("svgo", {
        describe: "Path to YAML or JS or JSON config file for SVGO",
      })
      .demand(1)
      .version(require("../package.json").version)
      .help("h")
      .alias("h", "help").argv
  );
}

function getSVGOOpts(argv) {
  let svgoOpts: any = {};

  if (typeof argv.svgo === "string") {
    svgoOpts = handlePath(argv.svgo);
  } else if (isPlainObject(argv.svgo)) {
    svgoOpts = argv.svgo;
    // convert plugin object to array of objects
    if (isPlainObject(svgoOpts.plugins)) {
      svgoOpts.plugins = Object.keys(svgoOpts.plugins).map((key) => {
        return { [key]: svgoOpts.plugins[key] === "false" ? false : true };
      });
    } else if (typeof svgoOpts.plugins === "string") {
      svgoOpts.plugins = [svgoOpts.plugins];
    }
  }

  return svgoOpts;
}

function getLoaderContext({ argv, query, file }) {
  return {
    query,
    addDependency() {},
    async() {
      return function (err, result) {
        /* eslint-disable no-console */
        if (err) console.error("REACT-SVG-LOADER ERROR", file, err.stack);
        else if (argv["stdout"]) console.log(result);
        else fs.writeFileSync(makeFilename(file), result);
        /* eslint-enable */
      };
    },
  };
}

function run() {
  const argv = getArgv();
  const svgoOpts = getSVGOOpts(argv);

  argv._.map((file) => {
    const source = fs.readFileSync(file);

    const query = {
      svgo: svgoOpts,
      jsx: argv.jsx,
      componentName: argv.componentName,
    };

    loader.apply(getLoaderContext({ argv, query, file }), [source]);
  });
}

if (require.main === module) {
  run();
}
