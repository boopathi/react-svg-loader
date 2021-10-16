import loader, { Options } from '../packages/react-svg-loader/src/loader'
import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import vm, { Context } from 'vm'
import { transformSync } from '@babel/core'

function load<T extends object = object>(content: string, options?: Options): Promise<React.FC<T>> {
  return new Promise(function (resolve, reject) {
    const context = {
      getOptions: () => options || {},
      async() {
        return function (err, result) {
          if (err) return reject(err)
          const exports = {}
          const sandbox: Context = { module: { exports }, exports, require }
          vm.runInNewContext(
            transformSync(result, {
              babelrc: false,
              configFile: false,
              presets: ['@babel/preset-env', '@babel/preset-react'],
            }).code,
            sandbox,
          )
          resolve(sandbox.exports.default)
        }
      },
    }
    loader.apply(context, [content])
  })
}

const shallowRenderer = createRenderer()

function render(element) {
  shallowRenderer.render(element)
  return shallowRenderer.getRenderOutput()
}

test('empty svg tag', async () => {
  const component = await load('<svg/>')
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
})

test('svg tag with some props', async () => {
  const component = await load('<svg width="50" height="50" />')
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual({ width: '50', height: '50' })
})

test('passing props to empty svg tag', async () => {
  const props = { width: 100, height: '100' }
  const component = await load('<svg/>')
  const rendered = render(React.createElement(component, props))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual({ width: 100, height: '100' })
})

test('overriding props of an svg', async () => {
  const props = { width: 100, height: '100' }
  const component = await load(`<svg width="50" height="50" />`)
  const rendered = render(React.createElement(component, props))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual({ width: 100, height: '100' })
})

test('namespace attr', async () => {
  const component = await load(`<svg xmlns:bullshit="adsf" />`)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual({})
})

test('should not convert data-* and aria-* props', async () => {
  const component = await load(`<svg data-foo="foo" aria-label="Open"></svg>`)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual({ 'data-foo': 'foo', 'aria-label': 'Open' })
})

const circle = `
<svg class='class1 class2' style='text-align: center; width: 100px;height:100px' fill="#ddd" pointer-events="stroke">
  <circle class='class3 class4' cx="50" cy="50" renderer="25" style="text-align: center; stroke: #000000;" stroke-width="5" />
</svg>
`

test('converts attr from hyphen to camel', async () => {
  const component = await load(circle)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props).toEqual(expect.objectContaining({ pointerEvents: 'stroke' }))
})

test('style attr of root svg', async () => {
  const component = await load(circle)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props.style).toEqual({ textAlign: 'center', width: '100px', height: '100px' })
})

test('converts class to className', async () => {
  const component = await load(circle)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props.className).toBe('class1 class2')
})

test('converts attr of children from hyphen to camel', async () => {
  const component = await load(circle)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props.children.type).toBe('circle')
  expect(rendered.props.children.props).toEqual(expect.objectContaining({ strokeWidth: '5' }))
})

test('style attr of children', async () => {
  const component = await load(circle)
  const rendered = render(React.createElement(component))

  expect(rendered.type).toBe('svg')
  expect(rendered.props.children.type).toBe('circle')
  expect(rendered.props.children.props.style).toEqual(
    expect.objectContaining({ stroke: '#000', textAlign: 'center' }),
  )
})

test('creating a named function', async () => {
  const component = await load(circle, { componentName: () => 'Circle' })
  expect(component.name).toBe('Circle')
})
