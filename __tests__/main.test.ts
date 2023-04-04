import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {Operator} from 'opendal'
import {run} from '../src/main'
import * as core from '@actions/core'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_PROVIDER'] = 'memory'
  process.env['INPUT_PROVIDER_OPTIONS'] = ''
  process.env['INPUT_INCLUDE'] = '**/__tests__/**/temp'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

test('test openDAL', async () => {
  const op = new Operator('memory', {})
  await op.write('temp', 'Hello World')
  const content = await op.read('temp')
  expect(content.toString()).toBe('Hello World')
})
