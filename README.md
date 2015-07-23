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

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ All ids are preserved as it is
+ `style` tags are parsed and outputted as objects
+ `root`'s attributes are parsed and overridden by props
+ namespace-d attributes (`myns:something`) are stripped
+ Only tags allowed by react are retrieved. Others are simply ignored
+ Width and Height are added to svg component by default and set to 300 when not defined
