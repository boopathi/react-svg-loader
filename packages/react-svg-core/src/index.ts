import Svgo from "svgo";
import { transformSync as babelTransform } from "@babel/core";
import plugin from "babel-plugin-react-svg";

import { validateAndFix } from "./svgo";

// SVGO Optimize
export function optimize(opts: any = {}): (content: string) => Promise<string> {
  opts = validateAndFix(opts);
  const svgo = new Svgo(opts);

  return (content: string) => svgo.optimize(content).then(data => data.data);
}

type TransformOpts = { jsx?: boolean; functionName?: string };

// Babel Transform
export function transform(
  opts: TransformOpts = {}
): (content: string) => string {
  const jsx = opts.jsx || false;
  const functionName = opts.functionName || null;

  return content =>
    babelTransform(content, {
      babelrc: false,
      configFile: false,
      presets: [jsx ? void 0 : require.resolve("@babel/preset-react")].filter(
        Boolean
      ),
      plugins: [require.resolve("@babel/plugin-syntax-jsx"), [plugin, {functionName}]]
    });
}
