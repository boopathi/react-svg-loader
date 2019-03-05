// @flow

// validates svgo opts
// to contain minimal set of plugins that will strip some stuff
// for the babylon JSX parser to work

import isPlainObject from "lodash.isplainobject";
import cloneDeep from "lodash.clonedeep";

const essentialPlugins = [
  "removeDoctype",
  "removeComments",
  "removeStyleElement"
];

export function validateAndFix(opts: any = {}) {
  if (!isPlainObject(opts))
    throw new Error("Expected options.svgo to be Object.");

  let cleanOpts = cloneDeep(opts);

  if (cleanOpts.plugins === void 0) cleanOpts.plugins = [];

  if (!Array.isArray(cleanOpts.plugins))
    throw new Error("Expected options.svgo.plugins to be an array");

  if (cleanOpts.plugins.length === 0) {
    cleanOpts.plugins = [...essentialPlugins].map(p => ({ [p]: true }));
  }

  const state = new Map();
  // mark all essential plugins as disabled
  for (const p of essentialPlugins) {
    state.set(p, false);
  }

  // parse through input plugins and mark enabled ones
  for (const plugin of cleanOpts.plugins) {
    if (isPlainObject(plugin)) {
      for (const pluginName of Object.keys(plugin)) {
        if (essentialPlugins.indexOf(pluginName) > -1) {
          // enable the plugin in-place if it's an essential plugin
          // $FlowFixMe: suppressing until refactor (`plugin` is a sealed obj)
          plugin[pluginName] = true;
          state.set(pluginName, true);
        }
      }
    } else if (typeof plugin === "string") {
      state.set(plugin, true);
    } else {
      throw new TypeError(
        "Expected SVGO plugin to be of type String or Object. Got " +
          typeof plugin
      );
    }
  }

  // add missing plugins
  for (const p of essentialPlugins) {
    if (!state.get(p)) {
      cleanOpts.plugins.push(p);
    }
  }

  // convert strings to objects to match the form svgo accepts
  for (let i = 0; i < cleanOpts.plugins.length; i++) {
    if (typeof cleanOpts.plugins[i] === "string") {
      cleanOpts.plugins[i] = { [cleanOpts.plugins[i]]: true };
    }
  }

  return cleanOpts;
}
