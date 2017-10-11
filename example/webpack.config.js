const reactSvgLoader = require.resolve("../packages/react-svg-loader");
const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: reactSvgLoader, // 'react-svg'
            query: {
              svgo: {
                pretty: true,
                plugins: [{ removeStyleElement: true }]
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};
