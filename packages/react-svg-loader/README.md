# react-svg-loader

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
Babel Transform with <code>preset=react</code> and <a href="https://github.com/boopathi/react-svg-loader/tree/master/packages/babel-plugin-react-svg"><code>plugin=svgToComponent</code></a>
</p>

## Assumptions and Other gotchas

+ Root element is always `<svg>`
+ SVG is optimized using SVGO

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
