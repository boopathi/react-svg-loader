import { transformSync as babelTransform } from "@babel/core";
import plugin from "babel-plugin-react-svg";
import Svgo from "svgo/lib/svgo/jsAPI";
import { validateAndFix } from "./svgo";


// SVGO Optimize
export function optimize(opts: any = {}): (content: string) => Promise<string> {
  opts = validateAndFix(opts);
  const svgo = new Svgo(opts);

  return (content: string) => svgo.optimize(content).then(data => data.data);
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
