import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

const glob = require('@actions/glob')

test('test glob', async () => {
  const patterns = ['.git/**', '.github/**']
  const globber = await glob.create(patterns.join('\n'), {
    followSymbolicLinks: false,
    implicitDescendants: true,
    matchDirectories: false,
    omitBrokenSymbolicLinks: true
  })
  console.log(__dirname)
  console.log(globber.getSearchPaths())
  for await (const file of globber.globGenerator()) {
    for (const base of globber.getSearchPaths()) {
      if (file.startsWith(base)) {
        const index = file.lastIndexOf('/')
        const uploadDir = file.substring(base.length, index)
        console.log(file, uploadDir)
      }
    }
  }
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
