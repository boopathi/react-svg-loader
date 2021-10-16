# react-svg-loader-cli

Provides CLI: `svg2react`

CLI of [react-svg-loader](/packages/react-svg-loader)

## Install

```sh
npm i react-svg-loader-cli --save-dev

# or with yarn

yarn add react-svg-loader-cli --dev
```

Install it globally,

```sh
npm i -g react-svg-loader-cli

# or with yarn

yarn global add react-svg-loader-cli
```

## Usage (svg2react)

Use this CLI to convert svg files to react components. This is helpful when you'd want to customize your svg component by hand.

```sh
`npm bin`/svg2react file1.svg file2.svg
```

and the following files will be emitted

+ `file1.svg.react.js`
+ `file2.svg.react.js`

in the **SAME directory** as the files

## CLI Options

+ `--jsx`: Outputs JSX code instead of compiling it to JavaScript using babel-preset-react
+ `--componentName`: Generating a named function
+ `--stdout`: Outputs to STDOUT
+ `--svgo <config_file>`: Supports SVGO Config YAML / JSON / JS
+ `--svgo.plugins <...plugins>`: Takes in an array of plugins that need to be enabled
+ `--svgo.plugins.<plugin> <true|false>`: - Enable/Disable the plugin
+ `--svgo.floatPrecision $N`: Set floatPrecision to `N` for SVGO. SVGO supports 1-8.

```
`npm bin`/svg2react file1.svg --jsx --stdout
```

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
