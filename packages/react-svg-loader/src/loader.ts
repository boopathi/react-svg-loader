import { optimize, transform } from '@lagunovsky/react-svg-core'
import type * as svgo from 'svgo'
import type * as webpack from 'webpack'

export type Options = {
  jsx?: boolean
  componentName?: (path: string) => string
  svgo?: svgo.OptimizeOptions
}

export default function loader(this: webpack.LoaderContext<Options>, content: string) {
  const options = this.getOptions()
  const componentName = options.componentName ? options.componentName(this.resourcePath) : undefined
  const cb = this.async()

  Promise.resolve(String(content))
    .then(optimize(options.svgo))
    .then(transform({ jsx: options.jsx, componentName }))
    .then(result => cb(null, result.code))
    .catch(err => cb(err))
}
