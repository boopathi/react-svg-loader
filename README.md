# react-svg-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/boopathi/react-svg-loader.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg?branch=master)](https://travis-ci.org/boopathi/react-svg-loader) [![npm version](https://badge.fury.io/js/react-svg-loader.svg)](https://badge.fury.io/js/react-svg-loader) [![Code Climate](https://codeclimate.com/github/boopathi/react-svg-loader/badges/gpa.svg)](https://codeclimate.com/github/boopathi/react-svg-loader) [![Test Coverage](https://codeclimate.com/github/boopathi/react-svg-loader/badges/coverage.svg)](https://codeclimate.com/github/boopathi/react-svg-loader/coverage)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Versions](#versions)
  - [Current](#current)
    - [Drops Node 0.12 support & webpack 1 support](#drops-node-012-support--webpack-1-support)
    - [Output change from component class to arrow function](#output-change-from-component-class-to-arrow-function)
    - [Extensible classes (now you can use with css-modules)](#extensible-classes-now-you-can-use-with-css-modules)
    - [Drop option `es5`](#drop-option-es5)
  - [v1.x](#v1x)
  - [v0.1.x](#v01x)
- [Install](#install)
- [Usage](#usage)
  - [Loader output](#loader-output)
  - [SVGO options](#svgo-options)
- [Internals](#internals)
  - [Transformations](#transformations)
    - [1. Hyphenated attributes to camelCase](#1-hyphenated-attributes-to-camelcase)
    - [2. Style attr string to object](#2-style-attr-string-to-object)
    - [3. Propagate props to root element](#3-propagate-props-to-root-element)
    - [4. class to className & class values to styles prop](#4-class-to-classname--class-values-to-styles-prop)
    - [5. export React.Component](#5-export-reactcomponent)
  - [Example](#example)
    - [Input SVG](#input-svg)
    - [Output React Component](#output-react-component)
- [CLI](#cli)
  - [CLI Options](#cli-options)
- [Assumptions and Other gotchas](#assumptions-and-other-gotchas)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Versions

### Current

VERSION: `2.0.0-alpha` (master)

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

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ SVG is optimized using SVGO

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
