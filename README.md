# react-svg-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/boopathi/react-svg-loader.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg?branch=master)](https://travis-ci.org/boopathi/react-svg-loader) [![npm version](https://badge.fury.io/js/react-svg-loader.svg)](https://badge.fury.io/js/react-svg-loader) [![Code Climate](https://codeclimate.com/github/boopathi/react-svg-loader/badges/gpa.svg)](https://codeclimate.com/github/boopathi/react-svg-loader) [![Test Coverage](https://codeclimate.com/github/boopathi/react-svg-loader/badges/coverage.svg)](https://codeclimate.com/github/boopathi/react-svg-loader/coverage)

## Versions

#### Current

+ v2.0.0-alpha.1 - master branch
+ Drops Node 0.12 support (use at your own risk)

#### v1.x

[branch=v1](https://github.com/boopathi/react-svg-loader/tree/v1)

#### v0.1.x

[branch=v0.1](https://github.com/boopathi/react-svg-loader/tree/v0.1)

## Install

```sh
npm i react-svg-loader
```

## Usage

```js
// without webpack loader config
import Image1 from 'react-svg-loader!./image1.svg';

// or if you're passing all .svg files via react-svg-loader,
import Image2 from './image1.svg';

// and use it like any other React Component
<Image1 width={50} height={50}/>
<Image2 width={50} height={50}/>
```

### Loader output

By default the loader outputs ES2015 code (with JSX compiled to JavaScript using babel-preset-react). You can combine it with babel-loader to compile it down to ES5.

```js
// In your webpack config
{
  test: /\.svg$/,
  loaders: [
    {
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    },
    {
      loader: 'react-svg-loader',
      query: {
        jsx: true
      }
    }
  ]
}
```

### JSX output

Pass loader query `jsx=true`.

```js
// In your webpack config
{
  test: /\.svg$/,
  loader: 'react-svg-loader?jsx=1'
}
```

### SVGO options

#### Webpack 1.x

```js
{
  test: /\.svg$/,
  loader: 'react-svg-loader',
  query: {
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
  loader: 'babel-loader!react-svg-loader?' + JSON.stringify({
    svgo: {
      // svgo options
      plugins: [{removeTitle: false}],
      floatPrecision: 2
    }
  }),
}
```

**If you want to use aria attributes in your SVGs**, set this SVGO plugin option:

```js
{ removeUnknownsAndDefaults: false }
```

#### Webpack 2.x

```js
{
  test: /\.svg$/,
  use: [
    {
      loader: 'babel-loader'
    },
    {
      loader: 'react-svg-loader',
      options: {
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

+ `--jsx`: Outputs JSX code instead of compiling it to JavaScript using babel-preset-react
+ `--stdout`: Outputs to STDOUT
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

MIT License - https://boopathi.mit-license.org/2015
