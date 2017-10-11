# react-svg-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/boopathi/react-svg-loader.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/boopathi/react-svg-loader.svg?branch=master)](https://travis-ci.org/boopathi/react-svg-loader) [![npm version](https://badge.fury.io/js/react-svg-loader.svg)](https://badge.fury.io/js/react-svg-loader) [![Code Climate](https://codeclimate.com/github/boopathi/react-svg-loader/badges/gpa.svg)](https://codeclimate.com/github/boopathi/react-svg-loader) [![Test Coverage](https://codeclimate.com/github/boopathi/react-svg-loader/badges/coverage.svg)](https://codeclimate.com/github/boopathi/react-svg-loader/coverage)

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

#### Move to 3 packages

Now react-svg-loader is split into 3 packages

+ [babel-plugin-react-svg](/packages/babel-plugin-react-svg)
+ [react-svg-loader](/packages/react-svg-loader)
+ [react-svg-loader-cli](/packages/react-svg-loader-cli)

### v1.x

[branch=v1](https://github.com/boopathi/react-svg-loader/tree/v1)

### v0.1.x

[branch=v0.1](https://github.com/boopathi/react-svg-loader/tree/v0.1)

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
