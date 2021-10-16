import { execFile } from 'child_process'
import path from 'path'

function exec(...args): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'node',
      [path.join(__dirname, '../packages/react-svg-loader-cli/lib/cli.js'), '--stdout', ...args],
      { cwd: path.join(__dirname, 'resources') },
      (err, stdout, stderr) => {
        if (err) {
          console.error(stderr)
          return reject(err)
        }
        resolve(stdout)
      },
    )
  })
}

test('accept single argument', async () => {
  const result = await exec('dummy.svg')
  expect(result).toMatchSnapshot()
})

test('accept multiple arguments', async () => {
  const result = await exec('dummy.svg', 'dummy2.svg')
  expect(result).toMatchSnapshot()
})

test('generate jsx', async () => {
  const result = await exec('dummy2.svg', '--jsx')
  expect(result).toMatchSnapshot()
})

test('accepts yaml/json/js svgo config', async () => {
  const yml = await exec('dummy.svg', '--svgo', 'config.yaml', '--jsx')
  expect(yml).toMatchSnapshot()

  const json = await exec('dummy.svg', '--svgo', 'config.json', '--jsx')
  expect(json).toMatchSnapshot()

  const js = await exec('dummy.svg', '--svgo', 'config.js', '--jsx')
  expect(js).toMatchSnapshot()
})
