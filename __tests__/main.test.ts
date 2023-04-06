import * as cp from 'child_process'
import * as path from 'path'
import {afterAll, beforeEach, describe, expect, jest, test} from '@jest/globals'
import {run} from '../src/main'
import {Operator} from 'opendal'

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
    process.env['INPUT_PROVIDER'] = 'memory'
    process.env['INPUT_PROVIDER_OPTIONS'] = ''
    process.env['INPUT_INCLUDE'] = '__tests__/**/temp'
    process.env['INPUT_FLATTEN'] = 'true'
    const np = process.execPath
    const ip = path.join(__dirname, '..', 'lib', 'main.js')
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  })

  test('test openDAL memory', async () => {
    process.env['INPUT_PROVIDER'] = 'memory'
    process.env['INPUT_PROVIDER_OPTIONS'] = ''
    process.env['INPUT_INCLUDE'] = '__tests__/**/temp'
    process.env['INPUT_FLATTEN'] = 'true'

    const op = await run()
    const content = await op!.read('temp')
    expect(content.toString().trim()).toEqual(
      'this test file for action-upload'
    )
  })
})
