var path = require('path');
var svgLoader = require.resolve('../');

module.exports = {
  entry: './index.js',
  output: {
    path: 'public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.svg$/,
        loader: 'babel!' + svgLoader + '?es5=true'
      },
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  }
};
