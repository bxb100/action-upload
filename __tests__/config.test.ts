import { afterEach, describe, expect, it, jest } from '@jest/globals'

import * as core from '../__fixtures__/core'
jest.unstable_mockModule('@actions/core', () => core)
const { Config } = await import('../src/config')

describe('config', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('runs', () => {
    process.env['INPUT_PROVIDER'] = 'memory'
    process.env['INPUT_PROVIDER_OPTIONS'] = `
  "A=1 "

  B = 2

  C=3
  ' D= 1=2=3'
  E =E=2
  =
  ==invalid==
  ## test=1
  `
    process.env['INPUT_INCLUDE'] =
      "\
      './**'\n\
      '!./exclude'\n\
      "
    process.env['INPUT_FLATTEN'] = 'true'

    const config = new Config()
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
})
