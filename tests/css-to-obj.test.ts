import cssToObj from '../packages/babel-plugin-react-svg/src/css-to-obj'

test('no entry check', () => {
  expect(cssToObj('')).toEqual({})
})

test('single entry check', () => {
  const css = cssToObj('text-align: center')
  expect(css).toEqual({ 'text-align': 'center' })
})

test('multiple entries check', () => {
  const url = 'https://example.com/image.svg'
  const css = cssToObj(`width: 50px; height: 50px; background:url(${url}); text-align: center;`)
  expect(css).toEqual({
    width: '50px',
    height: '50px',
    background: `url(${url})`,
    'text-align': 'center',
  })
})
