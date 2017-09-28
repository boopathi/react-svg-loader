# react-svg-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/boopathi/react-svg-loader.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg?branch=master)](https://travis-ci.org/boopathi/react-svg-loader) [![npm version](https://badge.fury.io/js/react-svg-loader.svg)](https://badge.fury.io/js/react-svg-loader) [![Code Climate](https://codeclimate.com/github/boopathi/react-svg-loader/badges/gpa.svg)](https://codeclimate.com/github/boopathi/react-svg-loader) [![Test Coverage](https://codeclimate.com/github/boopathi/react-svg-loader/badges/coverage.svg)](https://codeclimate.com/github/boopathi/react-svg-loader/coverage)

## Versions

### Current

VERSION: `2.0.0-alpha.2` (master)

*Note: This section will be moved to Changelog on `2.0.0` release.*

#### Drops Node 0.12 support & webpack 1 support

Tests are run on Node 4, 6, and 8

#### Output change from component class to arrow function

Previously, the output of the react-svg-loader was -

```js
import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg {...this.props}>{svgContent}</svg>;
  }
}
```

and now it is -

```js
import React from "react";
export default props => <svg {...props}>{svgContent}</svg>;
```

#### Extensible classes (now you can use with css-modules)

Previously, class values are NOT transformed. Now they are transformed such the component can be used with css-modules

```js
<svg class="foo bar">
```

is transformed to

```js
<svg className={ (styles["foo"] || "foo") + " " + (styles["bar"] || "bar") }></svg>
```

So, you can pass/override some styles in the svg, for example -

```js
import Image from "react-svg-loader!./image.svg";
import styles from "./styles.css"; // with css-modules

const imageStyles = {
  foo: styles.foo,
  bar: styles.bar
}

let component = <Image styles={imageStyles} />
```

#### Drop option `es5`

Previously, you could do,

```js
{
  loader: "react-svg-loader",
  options: {
    es5: true
  }
}
```

and get output transpiled to ES5 using babel-preset-es2015.

This is now deprecated and the **recommended** way to use react-svg-loader is to use it with [babel-loader](https://github.com/babel/babel-loader)

```js
{
  test: /\.svg$/,
  use: [
    "babel-loader",
    "react-svg-loader"
  ]
}
```

and with [babel-preset-env](https://github.com/babel/babel-preset-env) in `.babelrc`:

```json
{
  "presets": [
    [
      "env",
      {
        "target": {
          "browsers": "IE > 11"
        }
      }
    ]
  ]
}
```

### v1.x

[branch=v1](https://github.com/boopathi/react-svg-loader/tree/v1)

### v0.1.x

[branch=v0.1](https://github.com/boopathi/react-svg-loader/tree/v0.1)

## Install

```sh
npm i react-svg-loader --save-dev
```

or

```sh
yarn add react-svg-loader --dev
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

By default the loader outputs ES2015 code (with JSX compiled to JavaScript using babel-preset-react). You can combine it with [babel-loader](https://github.com/babel/babel-loader) + [babel-preset-env](https://github.com/babel/babel-preset-env) to compile it down to your target.

```js
// In your webpack config
{
  test: /\.svg$/,
  use: [
    {
      loader: "babel-loader"
    },
    {
      loader: "react-svg-loader",
      options: {
        jsx: true // true outputs JSX tags
      }
    }
  ]
}
```

### SVGO options

```js
{
  test: /\.svg$/,
  use: [
    "babel-loader",
    {
      loader: "react-svg-loader",
      options: {
        svgo: {
          plugins: [
            { removeTitle: false }
          ],
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
<svg width="50" {...props}>
  ...
</svg>
```

#### 4. class to className & class values to styles prop

```html
<svg class="foo bar"/>
```

is transformed to

```jsx
<svg className={ (styles["foo"] || "foo") + " " + (styles["bar"] || "bar") }>
```

#### 5. export React.Component

The loader should now export the svg component. And this is done by wrapping it in an ArrowFunctionExpression.

```html
<svg>...</svg>
```

is transformed to

```js
import React from 'react';
export default ({ styles = {}, ...props }) => <svg {...props}>...</svg>;
```

### Example

##### Input SVG

```html
<svg class="foo" style='text-align: center; width: 100px' pointer-events="stroke">
  <circle cx="50" cy="50" r="25" style="text-align: center;" stroke-width="5" />
</svg>
```

##### Output React Component

```js
import React from "react";
export default ({ styles = {}, ...props}) => <svg
  className={styles["foo"] || "foo"}
  style={{ textAlign: "center", width: "100px" }}
  pointerEvents="stroke"
  {...props}>
    <circle cx="50" cy="50" r="25" style={{textAlign: "center"}} strokeWidth="5" />
</svg>;
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
`npm bin`/svg2react file1.svg --jsx --stdout
```

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ SVG is optimized using SVGO

## LICENSE

MIT License - https://boopathi.mit-license.org/2015
