# react-svg-loader

**Not published yet. Under developement**

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
