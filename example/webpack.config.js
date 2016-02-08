var path = require('path');
var svgLoader = path.join(__dirname, '..', 'lib', 'index.js');

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
        loader: 'babel!' + svgLoader
      },
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  }
};
