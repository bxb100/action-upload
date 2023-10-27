import {expect, test} from '@jest/globals'
import {includeFiles} from '../src/glob-helper'
import assert = require('assert')
import * as path from 'path'

test('test glob', async () => {
  const patterns = ['__tests__/']
  const file = await includeFiles(patterns)
  assert(file.length > 0)
  for (let pathSpec of file) {
    console.log(pathSpec)
    assert.equal(path.join(__dirname, pathSpec.path), pathSpec.fsPath)
  }
})

test('test double asterisk', async () => {
  const patterns = ['**/__tests__/']
  const file = await includeFiles(patterns)

  const patterns2 = ['**/__tests__/**']
  const file2 = await includeFiles(patterns2)

  assert.deepEqual(file, file2)

  for (let pathSpec of file) {
    assert(pathSpec.dir)
  }
}, 100000)

test('github issue 110 - workspace', async () => {
  const patterns = [
    './**',
    '!dist',
    '!node_modules/**',
    '!__tests__/**',
    '!.git',
    '!.idea',
    '!.github',
    '!lib'
  ]
  const file = await includeFiles(patterns)

  expect(file.map(s => s.path)).toMatchSnapshot()
})

test('github issue 110 - __test__ dir', async () => {
  const patterns = ['./__tests__/**', '!./__tests__/exclude/**']
  const file = await includeFiles(patterns)

  expect(file.map(s => s.path)).toMatchSnapshot()
})
