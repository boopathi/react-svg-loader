// @flow

import Svgo from "svgo";
import { transform as babelTransform } from "babel-core";
import plugin from "babel-plugin-react-svg";

import { validateAndFix } from "./svgo";

// SVGO Optimize
export function optimize(opts: any = {}): string => Promise<string> {
  validateAndFix(opts);
  const svgo = new Svgo(opts);

  return (content: string) =>
    new Promise((resolve, reject) =>
      svgo.optimize(
        content,
        ({ error, data }) => (error ? reject(error) : resolve(data))
      )
    );
}

// Babel Transform
export function transform(
  { jsx = false }: { jsx: boolean } = {}
): string => string {
  return content =>
    babelTransform(content, {
      babelrc: false,
      presets: [jsx ? void 0 : "react"].filter(Boolean),
      plugins: ["syntax-jsx", "transform-object-rest-spread", plugin]
    });
}
