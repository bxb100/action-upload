import { expect, test } from '@jest/globals'
import { ConfigHelper } from '../src/config-helper'

test('runs', () => {
  process.env['INPUT_PROVIDER'] = 'memory'
  process.env['INPUT_PROVIDER_OPTIONS'] = `
  A=1
  B = 2
  C=3
  D= 1=2=3
  E =E=2
  `
  process.env['INPUT_INCLUDE'] =
    "\
  './**'\n\
  '!./exclude'\n\
  "
  process.env['INPUT_FLATTEN'] = 'true'

  const config = new ConfigHelper()
  expect(config.provider).toBe('memory')
  expect(config.options).toEqual({
    A: '1',
    B: '2',
    C: '3',
    D: '1=2=3',
    E: 'E=2'
  })
  expect(config.patterns).toEqual(['./**', '!./exclude'])
  expect(config.flatten).toBe(true)
})
