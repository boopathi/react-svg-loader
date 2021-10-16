# Changelog

## 3.0.3

- Ignore babel config files during transformation [#264](https://github.com/boopathi/react-svg-loader/pull/264)

## 3.0.1

- Fix `package.json` version updates ([27bce4a](https://github.com/boopathi/react-svg-loader/commit/27bce4a34c1d9e184619a34c2e3f7ce5bfa019a6))

## 3.0.0

- Drop Node 6. Run tests on Node 8, 10, and 12
- Upgrade dependencies

Fixes:

- Close svgo object instead of mutating it ([#250](https://github.com/boopathi/react-svg-loader/pull/250))
- Compatibility between babel 6 and 7 for `t.restElement` and `t.restProperty` ([#244](https://github.com/boopathi/react-svg-loader/pull/244))
- Update to use fully resolved paths for babel plugins ([#209](https://github.com/boopathi/react-svg-loader/pull/209))

## 2.1.0

### Rollup plugin

Two new packages -

- [react-svg-core](/packages/react-svg-core) - shared between webpack loader and rollup plugin
- [rollup-plugin-react-svg](/packages/rollup-plugin-react-svg) - rollup plugin to load `.svg` files as react components

## 2.0.0

### Drops Node 0.12 support & webpack 1 support

Tests are run on Node 4, 6, and 8

### Output change from component class to arrow function

Previously, the output of the react-svg-loader was -

```js
import React from 'react'
export default class SVG extends React.Component {
  render() {
    return <svg {...this.props}>{svgContent}</svg>
  }
}
```

and now it is -

```js
import React from 'react'
export default props => <svg {...props}>{svgContent}</svg>
```

### Overridable classnames (to use with css-modules)

Previously, class values are NOT transformed. Now they are transformed such that the output component can be used with css-modules

```js
<svg class="foo bar">
```

is transformed to

```js
<svg className={ (styles["foo"] || "foo") + " " + (styles["bar"] || "bar") }>
```

So, you can pass/override some styles in the svg, for example -

```js
import Image from 'react-svg-loader!./image.svg'
import styles from './styles.css' // with css-modules

const imageStyles = {
  foo: styles.foo,
  bar: styles.bar,
}

let component = <Image styles={imageStyles} />
```

### Drop option `es5`

Previously, you could do,

```js
{
  loader: 'react-svg-loader',
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

```js
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

- [babel-plugin-react-svg](/packages/babel-plugin-react-svg)
- [react-svg-loader](/packages/react-svg-loader)
- [react-svg-loader-cli](/packages/react-svg-loader-cli)
