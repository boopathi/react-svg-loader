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

### MyComponent.js

All the props are passed onto the root svg element.

```js
import Image from './image.svg';

// ...
  <Image width={400} height={200} />
// ...
```

### Options

The ouput svg component takes in options that are defined in the svg

### CLI

The react-svg-loader comes with a cli (`svg2react`) that you can use to convert svg files to react components. Use this tool when you'd want to customize your svg component by hand. Otherwise the loader just works.

```sh
`npm bin`/svg2react file1.svg file2.svg
```

and the following files will be emitted

+ `file1.svg.react.js`
+ `file2.svg.react.js`

in the SAME directory as the files

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ namespace-d attributes (`myns:something`) are stripped
+ Hyphenated attributes are converted to camelCase. Others are preserved as it is
+ `style` tags are parsed and outputted as objects
+ `root`'s attributes are parsed and overridden by props
+ Only tags allowed by react are retrieved. Others are simply ignored
+ Order of the tags are maintained as it is
+ Width and Height are added to svg component by default and set to 300 when not defined
+ All attributes passed to the generated Component are passed onto the root svg element

## LICENSE

MIT License - http://boopathi.mit-license.org
