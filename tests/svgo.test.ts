import { validateAndFix } from '../packages/react-svg-core/src/svgo'

test('fills essential plugins and default plugins when empty', () => {
  const opts = validateAndFix()
  expect(opts.plugins).toEqual(['preset-default', 'removeStyleElement'])
})

test('enable disabled essential plugins', () => {
  const opts = validateAndFix({
    full: true,
    multipass: true,
    plugins: ['removeDoctype', { name: 'removeComments', active: false }],
  })

  expect(opts).toEqual({
    full: true,
    multipass: true,
    plugins: [
      { name: 'removeDoctype' },
      { name: 'removeComments' },
      { name: 'removeStyleElement' },
      { name: 'removeXMLProcInst' },
      { name: 'removeMetadata' },
      { name: 'removeEditorsNSData' },
    ],
  })
})
