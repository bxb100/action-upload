import {test} from '@jest/globals'
import {ConfigHelper} from '../src/config-helper'
import assert = require('assert')

test('test runs', () => {
  process.env['INPUT_PROVIDER'] = 'memory'
  process.env['INPUT_PROVIDER_OPTIONS'] = `
  A=1
  B = 2
  C=3
  D= 1=2=3
  E =E=2
  `
  process.env['INPUT_INCLUDE'] = '**/__tests__/**/temp'
  process.env['INPUT_FLATTEN'] = 'true'

  const config = new ConfigHelper()
  assert.equal(config.provider, 'memory')
  assert.deepEqual(config.options, {A: 1, B: 2, C: 3, D: '1=2=3', E: 'E=2'})
  assert.deepEqual(config.patterns, ['**/__tests__/**/temp'])
  assert.equal(config.flatten, true)
})
