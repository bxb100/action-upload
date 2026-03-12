import assert from 'node:assert'
import * as path from 'path'

import { afterEach, describe, expect, it, jest } from '@jest/globals'

import * as core from '../__fixtures__/core'
jest.unstable_mockModule('@actions/core', () => core)
const { includeFiles } = await import('../src/glob')

const __dirname = import.meta.dirname

describe('glob', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('glob', async () => {
    const patterns = ['__tests__/']
    const file = await includeFiles(patterns)
    assert(file.length > 0)
    for (const pathSpec of file) {
      expect(pathSpec.file).toBe(
        path.join(__dirname, pathSpec.parentDir, pathSpec.filename)
      )
    }
  })

  it('fixed search path', async () => {
    const patterns = [`${__dirname}/fixture/temp`]
    const file = await includeFiles(patterns)
    assert(file.length === 1)
    expect(file[0].dest).toBe('temp')
    expect(file[0].parentDir).toBeFalsy()
  })

  it('double asterisk', async () => {
    const patterns = ['**/__tests__/']
    const file = await includeFiles(patterns)

    const patterns2 = ['**/__tests__/**']
    const file2 = await includeFiles(patterns2)

    expect(file).toStrictEqual(file2)

    for (const pathSpec of file) {
      expect(pathSpec.parentDir).toBeTruthy()
    }
  }, 100000)

  it('github issue 110 - workspace', async () => {
    const patterns = [
      './**',
      '!dist',
      '!node_modules/**',
      '!__fixtures__/**',
      '!__tests__/**',
      '!.git',
      '!.idea',
      '!.github',
      '!lib',
      '!coverage/**',
      '!.env'
    ]
    const file = await includeFiles(patterns)

    expect(file.map((s) => s.dest)).toMatchSnapshot()
  })

  it('github issue 110 - __test__ dir', async () => {
    const patterns = ['./__tests__/**', '!./__tests__/exclude/**']
    const file = await includeFiles(patterns)

    expect(file.map((s) => s.dest)).toMatchSnapshot()
  })
})
