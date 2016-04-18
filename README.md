# react-svg-loader

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg?branch=master)](https://travis-ci.org/boopathi/react-svg-loader) [![npm version](https://badge.fury.io/js/react-svg-loader.svg)](https://badge.fury.io/js/react-svg-loader) [![Code Climate](https://codeclimate.com/github/boopathi/react-svg-loader/badges/gpa.svg)](https://codeclimate.com/github/boopathi/react-svg-loader) [![Test Coverage](https://codeclimate.com/github/boopathi/react-svg-loader/badges/coverage.svg)](https://codeclimate.com/github/boopathi/react-svg-loader/coverage)

## Old version

Now `master` represents the new rewrite of the react-svg loader. Though this gives the exact same output as the previous one, the entire parsing is changed. So if you'd like to continue using the old one, it's in [`v0.1` branch](https://github.com/boopathi/react-svg-loader/tree/v0.1) and `^0.1.0` on npm.

## Install

```sh
npm i react-svg-loader
```

## Usage

```js
var Image1 = require('react-svg?es5=1!./image1.svg');
// or
var Image2 = require('babel!react-svg!./image2.svg');

// and use it as
<Image1 width={50} height={50}/>
<Image2 width={50} height={50}/>
```

### ES2015 + JSX output

By default the loader outputs ES2015 and JSX code and should be transpiled with babel or any other transpiler that supports ES2015 and JSX.

```js
// In your webpack config
{
  test: /\.svg$/,
  loader: 'babel!react-svg'
}
```

### ES5 output

Pass loader query `es5=true`.

Note: babel transform is applied with `react` and `es2015-loose` presets.

```js
// In your webpack config
{
  test: /\.svg$/,
  loader: 'react-svg?es5=1'
}
```

### SVGO options

#### Webpack 1.x

```js
{
  test: /\.svg$/,
  loader: 'react-svg',
  query: {
    es5: true,
    svgo: {
      // svgo options
      plugins: [{removeTitle: false}],
      floatPrecision: 2
    }
  }
}
```

or if you're using with babel-loader, you can

```js
{
  test: /\.svg$/,
  loader: 'babel!react-svg?' + JSON.stringify({
    svgo: {
      // svgo options
      plugins: [{removeTitle: false}],
      floatPrecision: 2
    }
  }),
}
```

#### Webpack 2.x

```js
{
  test: /\.svg$/,
  loaders: [ 'babel',
    {
      loader: 'react-svg',
      query: {
        svgo: {
          plugins: [{removeTitle: false}],
          floatPrecision: 2
        }
      }
    }
  ]
}
```

## Internals

<p align="center">
Input SVG
</p>
<p align="center">↓</p>
<p align="center">
SVG Optimize using <a href="https://github.com/svg/svgo">SVGO</a>
</p>
<p align="center">↓</p>
<p align="center">
Babel Transform with <code>preset=react</code> and <a href="src/plugin.js"><code>plugin=svgToComponent</code></a>
</p>

### Transformations

Going from bottom up, the following transformations are applied and the same can be checked in the partly annotated source - [babel-plugin](src/plugin.js)

#### 1. Hyphenated attributes to camelCase

```html
<svg pointer-events="none">
  <path stroke-width="5"/>
</svg>
```

is transformed to

```html
<svg pointerEvents="none">
  <path strokeWidth="5"/>
</svg>
```

#### 2. Style attr string to object

React expects style attribute value to be an object. Also, Hyphenated style names are converted to camel case.

```html
<svg style="text-align: center">
  <circle style="width: 10px"/>
</svg>
```

is transformed to

```html
<svg style={{textAlign: 'center'}}>
  <circle style={{width: '10px'}}/>
</svg>
```

#### 3. Propagate props to root element

The props passed to the output component is passed on to the root SVG node and the props already defined are overridden by the props passed.

```html
<svg width="50">
  ...
</svg>
```

is transformed to

```html
<svg width="50" {...this.props}>
  ...
</svg>
```

#### 4. class to className

```html
<svg class="hello"/>
```

is transformed to

```html
<svg className="hello"/>
```

#### 5. export React.Component

The loader should now export the svg component. And this is done by wrapping it in a Component Class.

```html
<svg>...</svg>
```

is transformed to

```js
import React from 'react';
export default class SVG extends React.Component {
  render() {
    return <svg>...</svg>;
  }
}
```

### Example

##### Input SVG

```html
<svg style='text-align: center; width: 100px' pointer-events="stroke">
  <circle cx="50" cy="50" r="25" style="text-align: center;" stroke-width="5" />
</svg>
```

##### Output React Component

```js
import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg
      style={{ textAlign: "center", width: "100px" }}
      pointerEvents={this.props.pointerEvents ? this.props.pointerEvents : "stroke"}
      {...this.props} >
        <circle cx="50" cy="50" r="25" style={{textAlign: "center"}} strokeWidth="5" />
    </svg>;
  }
}
```

## CLI

The react-svg-loader comes with a cli (`svg2react`) that you can use to convert svg files to react components. Use this tool when you'd want to customize your svg component by hand. Otherwise the loader just works.

```sh
`npm bin`/svg2react file1.svg file2.svg
```

and the following files will be emitted

+ `file1.svg.react.js`
+ `file2.svg.react.js`

in the **SAME directory** as the files

### CLI Options

+ `-5` | `--es5`: Transforms ES2015+JSX output to ES5 using `presets=[es2015-loose, react]`
+ `-0` | `--stdout`: Outputs to STDOUT
+ `--svgo <config_file>`: Supports SVGO Config YAML / JSON / JS
+ `--svgo.plugins <...plugins>`: Takes in an array of plugins that need to be enabled
+ `--svgo.plugins.<plugin> <true|false>`: - Enable/Disable the plugin
+ `--svgo.floatPrecision $N`: Set floatPrecision to `N` for SVGO. SVGO supports 1-8.

```
`npm bin`/svg2react file1.svg --es5 -0
```

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ SVG is optimized using SVGO

## LICENSE

MIT License - http://boopathi.mit-license.org
