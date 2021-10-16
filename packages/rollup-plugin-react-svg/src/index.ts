import { optimize, transform } from '@lagunovsky/react-svg-core'
import * as fs from 'fs'
import * as path from 'path'
import { createFilter } from 'rollup-pluginutils'
import type * as svgo from 'svgo'

type PluginOpts = {
  include?: Array<string | RegExp> | string | RegExp | null
  exclude?: Array<string | RegExp> | string | RegExp | null
  svgo?: svgo.OptimizeOptions
  jsx?: boolean
  componentName?: (path: string) => string
}

export default function reactSvgLoadPlugin(options: PluginOpts = {}) {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'react-svg',
    load(id: string) {
      if (!filter(id) || path.extname(id) !== '.svg') return

      const contents = fs.readFileSync(id)

      const componentName = options.componentName ? options.componentName(id) : null

      return Promise.resolve(String(contents))
        .then(optimize(options.svgo))
        .then(transform({ jsx: options.jsx, componentName }))
        .then(result => result.code)
    },
  }
}
