import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";

import reactSvg from "rollup-plugin-react-svg";

export default {
  input: "index.js",
  output: {
    format: "iife",
    file: "public/bundle.js"
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    nodeResolve(),
    cjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),

    // USAGE:
    reactSvg({
      // svgo options
      svgo: {
        plugins: [], // passed to svgo
        multipass: true
      },

      // whether to output jsx
      jsx: false,

      include: null,

      exclude: null
    })
  ]
};
