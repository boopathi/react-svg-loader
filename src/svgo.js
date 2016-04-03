// validates svgo opts
// to contain minimal set of plugins that will strip some stuff
// for the babylon JSX parser to work
import isPlainObject from 'lodash.isplainobject';

export const essentialPlugins = ['removeDoctype', 'removeComments']

export function isEssentialPlugin(p) {
  return essentialPlugins.indexOf(p) !== -1;
}

export function validateAndFix(opts) {

  if (!isPlainObject(opts)) return;

  if (opts.full) {
    if (typeof opts.plugins === 'undefined' ||
      (Array.isArray(opts.plugins) && opts.plugins.length === 0)) {
      opts.plugins = [...essentialPlugins];
      return;
    }
  }

  // opts.full is false, plugins can be empty
  if (typeof opts.plugins === 'undefined') return;
  if (Array.isArray(opts.plugins) && opts.plugins.length === 0) return;

  // track whether its defined in opts.plugins
  let state = essentialPlugins.reduce((p, c) => Object.assign(p, {[c]: false}), {});

  opts.plugins.map(p => {
    if (typeof p === 'string' && isEssentialPlugin(p)) {
      state[p] = true;
    } else if (typeof p === 'object') {
      Object.keys(p).forEach(k => {
        if (isEssentialPlugin(k)) {
          // make it essential
          if (!p[k]) p[k] = true;
          // and update state
          state[k] = true;
        }
      });
    }
  });

  Object.keys(state)
    .filter(key => !state[key])
    .forEach(key => opts.plugins.push(key));

}
