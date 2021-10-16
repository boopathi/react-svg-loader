// validates svgo opts
// to contain minimal set of plugins that will strip some stuff
// for the babylon JSX parser to work

import isPlainObject from 'lodash.isplainobject'
import * as svgo from 'svgo'
import { DefaultPlugin, DefaultPlugins, Plugin } from 'svgo'

type ProcessedPlugin = svgo.DefaultPlugins | svgo.CustomPlugin<object>
type ProcessedPluginMap = Map<ProcessedPlugin['name'], ProcessedPlugin>

const necessaryPlugins: DefaultPlugins['name'][] = [
  'removeDoctype',
  'removeComments',
  'removeStyleElement',
  'removeXMLProcInst',
  'removeMetadata',
  'removeEditorsNSData',
]

export function validateAndFix(opts: svgo.OptimizeOptions = {}) {
  if (!isPlainObject(opts)) {
    throw new Error('Expected options.svgo to be Object.')
  }

  if (!Array.isArray(opts.plugins)) {
    opts.plugins = ['preset-default', 'removeStyleElement']
    return opts
  }

  const plugins: ProcessedPluginMap = new Map()

  opts.plugins.forEach(plugin => {
    if (typeof plugin === 'string') {
      plugins.set(plugin, { name: plugin } as ProcessedPlugin)
    } else {
      plugins.set(plugin.name, plugin)
    }
  })

  if (plugins.has('preset-default')) {
    const plugin = plugins.get('preset-default') as svgo.PresetDefault
    if (plugin.params && plugin.params.overrides) {
      necessaryPlugins.forEach(necessaryPlugin => {
        if (plugin.params.overrides[necessaryPlugin] === false) {
          delete plugin.params.overrides[necessaryPlugin]
        }
      })
    }
    if (!plugins.has('removeStyleElement')) {
      plugins.set('removeStyleElement', { name: 'removeStyleElement' })
    }
  } else {
    necessaryPlugins.forEach(necessaryPlugin => {
      const plugin = plugins.get(necessaryPlugin) as DefaultPlugin<string, object>
      if (!plugin) {
        plugins.set(necessaryPlugin, { name: necessaryPlugin } as ProcessedPlugin)
      } else if (Object.prototype.hasOwnProperty.call(plugin, 'active')) {
        delete plugin.active
      }
    })
  }

  opts.plugins = Array.from(plugins.values()) as Plugin[]
  return opts
}
