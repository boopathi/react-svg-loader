import { transformSync as babelTransform } from "@babel/core";
import plugin from "babel-plugin-react-svg";
import { optimize as svgOptimize } from "svgo";
import { validateAndFix } from "./svgo";

// SVGO Optimize
export function optimize(opts: any = {}) {
  const optionsValid = validateAndFix(opts)
  const optimized = svgOptimize(optionsValid);
  return optimized;
}

// Babel Transform
export function transform({ jsx = false }: { jsx?: boolean } = {}): (
  content: string
) => string {
  return content =>
    babelTransform(content, {
      babelrc: false,
      configFile: false,
      presets: [jsx ? void 0 : require.resolve("@babel/preset-react")].filter(
        Boolean
      ),
      plugins: [require.resolve("@babel/plugin-syntax-jsx"), plugin]
    });
}
