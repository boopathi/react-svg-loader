# babel-plugin-react-svg

A plugin that converts svg to a react component. Used in [react-svg-loader](/packages/react-svg-loader)

## Install

```sh
npm i babel-plugin-react-svg --save-dev

# or with yarn

yarn add babel-plugin-react-svg --dev
```

## Example

Input SVG:

```html
<svg class="foo" style='text-align: center; width: 100px' pointer-events="stroke">
  <circle cx="50" cy="50" r="25" style="text-align: center;" stroke-width="5" />
</svg>
```

Output React Component:

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

## Transformations

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

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ SVG is optimized using SVGO

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
