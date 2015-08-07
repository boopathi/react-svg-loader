# react-svg-loader

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg)](https://travis-ci.org/boopathi/react-svg-loader)

## Install

```sh
npm i react-svg-loader
```

## Usage

This outputs ES6+JSX code and to be used with `babel-loader`

```js
module.exports = {
  loaders: [
    {
      test: /\.svg$/,
      loader: 'babel!react-svg'
    }
  ]
}
```

### Output

of react-svg-loader

```js
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg>
      ...
    </svg>;
  }
}
```

and this should be passed through babel-loader

### Options

The ouput svg component takes in options that are defined in the svg

### CLI

The react-svg-loader comes in with a cli that you can use to convert svg files to react components.

#### Usage

```sh
`npm bin`/svg2react file1.svg file2.svg
```

and the following files will be emitted

+ `file1.react.svg`
+ `file2.react.svg`

in the SAME directory as the files

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ All ids are preserved as it is
+ `style` tags are parsed and outputted as objects
+ `root`'s attributes are parsed and overridden by props
+ namespace-d attributes (`myns:something`) are stripped
+ Only tags allowed by react are retrieved. Others are simply ignored
+ Order of the tags are maintained as it is
+ Width and Height are added to svg component by default and set to 300 when not defined
