import * as fs from "fs";
import * as path from "path";
import { transform, optimize } from "react-svg-core";
import { createFilter } from "rollup-pluginutils";

type PluginOpts = {
  include?: any;
  exclude?: any;
  svgo?: any;
  jsx?: boolean;
};

export default function reactSvgLoadPlugin(options: PluginOpts = {}): any {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "react-svg",
    load(id: string) {
      if (!filter(id) || path.extname(id) !== ".svg") return;

      const contents = fs.readFileSync(id);

      return Promise.resolve(String(contents))
        .then(optimize(options.svgo))
        .then(transform({ jsx: options.jsx }))
        .then((result: any) => result.code);
    }
  };
}
