module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: 6
        }
      }
    ],
    "@babel/preset-flow"
  ],
  plugins: ["add-module-exports"],
  env: {
    test: {
      plugins: ["istanbul"]
    }
  }
};
