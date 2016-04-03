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
        loaders: [
          'babel',
          {
            loader: svgLoader, // 'react-svg'
            query: {
              es5: false,
              svgo: {
                pretty: true
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  }
};
