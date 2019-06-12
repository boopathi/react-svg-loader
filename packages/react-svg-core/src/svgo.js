// @flow

// validates svgo opts
// to contain minimal set of plugins that will strip some stuff
// for the babylon JSX parser to work

import isPlainObject from "lodash.isplainobject";
import cloneDeep from "lodash.clonedeep";

const essentialPlugins = {
  removeDoctype: true,
  removeComments: true,
  removeStyleElement: true
};

// If not explicitly set by the user, then set this value
const pluginDefaults = {
  removeViewBox: false
};

type SvgoPlugin = {
  [key: string]: any
};

function getPlugin(
  pluginLike: string | SvgoPlugin,
  value: boolean = true
): [string, SvgoPlugin] {
  if (typeof pluginLike === "string") {
    return [
      pluginLike,
      {
        [pluginLike]: value
      }
    ];
  }
  const pluginName = Object.keys(pluginLike)[0];
  return [pluginName, pluginLike];
}

export function validateAndFix(opts: any = {}) {
  if (!isPlainObject(opts))
    throw new Error("Expected options.svgo to be Object.");

  let cleanOpts = cloneDeep(opts);

  const plugins = new Map<string, SvgoPlugin>();

  // add user input plugins to the map
  if (Array.isArray(cleanOpts.plugins)) {
    for (const plugin of cleanOpts.plugins) {
      const p = getPlugin(plugin);
      plugins.set(p[0], p[1]);
    }
  }

  for (let plugin in essentialPlugins) {
    if (hop(essentialPlugins, plugin)) {
      const p = getPlugin(plugin, essentialPlugins[plugin]);
      // overwrite
      plugins.set(p[0], p[1]);
    }
  }

  for (let plugin in pluginDefaults) {
    if (hop(pluginDefaults, plugin)) {
      const p = getPlugin(plugin, pluginDefaults[plugin]);
      // do not overwrite
      const existingPlugin = plugins.get(p[0]);
      if (existingPlugin == null) {
        plugins.set(p[0], p[1]);
      }
    }
  }

  cleanOpts.plugins = [];
  for (const [, plugin] of plugins) {
    cleanOpts.plugins.push(plugin);
  }

  return cleanOpts;
}

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}
