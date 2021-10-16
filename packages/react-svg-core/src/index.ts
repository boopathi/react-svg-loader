import { PluginItem, transformSync } from '@babel/core'
import * as svgo from 'svgo'
import { validateAndFix } from './svgo'

// SVGO Optimize
export function optimize(opts: svgo.OptimizeOptions = {}) {
  return (content: string) => svgo.optimize(content, validateAndFix(opts)).data
}

type Options = { jsx?: boolean; componentName?: string }

// Babel Transform
export function transform(options: Options = {}) {
  const jsx = options.jsx || false
  const componentName = options.componentName || null

  const presets: PluginItem[] = []
  if (!jsx) {
    presets.push(require.resolve('@babel/preset-react'))
  }

  return content =>
    transformSync(content, {
      babelrc: false,
      configFile: false,
      presets: presets,
      plugins: [
        [require.resolve('@babel/plugin-syntax-jsx')],
        [require.resolve('@lagunovsky/babel-plugin-react-svg'), { componentName }],
      ],
    })
}
