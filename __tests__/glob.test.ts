import assert from 'node:assert'
import * as path from 'path'

import { afterEach, describe, expect, it, jest } from '@jest/globals'

import * as core from '../__fixtures__/core'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
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
      '!__fixtures__',
      '!__tests__',
      '!dist',
      '!.git',
      '!.idea',
      '!.github'
    ]
    // respect .gitignore
    const gitignore = await readFile(join(__dirname, '../.gitignore'), 'utf-8')
    const gitignorePatterns = gitignore
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && !line.startsWith('!'))
      .map((line) => `!${line}`)
    patterns.push(...gitignorePatterns)

    const file = await includeFiles(patterns)

    expect(file.map((s) => s.dest)).toMatchSnapshot()
  })

  it('github issue 110 - __test__ dir', async () => {
    const patterns = ['./__tests__/**', '!./__tests__/exclude/**']
    const file = await includeFiles(patterns)

    expect(file.map((s) => s.dest)).toMatchSnapshot()
  })
})
