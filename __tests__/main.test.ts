import * as cp from 'child_process'
import * as path from 'path'
import {afterAll, beforeEach, describe, expect, jest, test} from '@jest/globals'
import {run} from '../src/main'

function getVariableKey(name: string) {
  return name.replace(/\./g, '_').replace(/ /g, '_').toUpperCase()
}

function setInput(key: string, val: string) {
  process.env['INPUT_' + getVariableKey(key)] = val
}

describe('test basic function', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = {...OLD_ENV} // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  // shows how the runner will run a javascript action with env / stdout protocol
  test('test runs', () => {
    setInput('provider', 'memory')
    setInput('provider_options', '')
    setInput('include', '__tests__/**/temp')
    setInput('flatten', 'true')

    const np = process.execPath
    const ip = path.join(__dirname, '..', 'lib', 'main.js')

    console.log(cp.execFileSync(np, [ip], {env: process.env}).toString())
  })

  test('test openDAL memory', async () => {
    setInput('provider', 'memory')
    setInput('provider_options', '')
    setInput('include', '__tests__/**/temp')
    setInput('flatten', 'true')

    const op = await run()
    const content = await op!.read('temp')
    expect(content.toString().trim()).toEqual(
      'this test file for action-upload'
    )
  })
})
