import * as core from '@actions/core'
import { jest } from '@jest/globals'

export const debug = jest.fn<typeof core.debug>()
export const error = jest.fn<typeof core.error>()
export const info = jest.fn<typeof core.info>()
export const getInput = jest
  .fn<typeof core.getInput>()
  .mockImplementation(core.getInput)
export const getMultilineInput = jest
  .fn<typeof core.getMultilineInput>()
  .mockImplementation(core.getMultilineInput)
export const getBooleanInput = jest
  .fn<typeof core.getBooleanInput>()
  .mockImplementation(core.getBooleanInput)
export const setFailed = jest.fn<typeof core.setFailed>()
export const warning = jest.fn<typeof core.warning>()
export const startGroup = jest.fn<typeof core.startGroup>()
export const endGroup = jest.fn<typeof core.endGroup>()
