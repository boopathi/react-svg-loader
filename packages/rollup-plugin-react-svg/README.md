# rollup-plugin-react-svg

Load SVG images as React Components

## Install

```sh
npm i rollup-plugin-react-svg --save-dev

# or with yarn

yarn add rollup-plugin-react-svg --dev
```

## Usage

```js
// rollup.config.js
import reactSvg from "rollup-plugin-react-svg";
import path from 'path';

export default {
  ...opts,
  plugins: [
    ...plugins,

    reactSvg({
      // svgo options
      svgo: {
        plugins: [], // passed to svgo
        multipass: true
      },

      // whether to output jsx
      jsx: false,

      // whether to output a named function
      functionName: (filePath) => path.parse(filePath).name,

      // include: string
      include: null,

      // exclude: string
      exclude: null
    })
  ]
}
```

## LICENSE

[MIT](https://github.com/boopathi/react-svg-loader/blob/master/LICENSE)
