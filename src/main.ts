import * as core from '@actions/core'
import * as fs from 'fs'
import {ConfigHelper} from './config-helper'
import {Operator} from 'opendal'
import {includeFiles} from './glob-helper'

async function run(): Promise<void> {
  try {
    const config = new ConfigHelper()
    core.debug(`provider options: ${JSON.stringify(config.options)}`)
    core.debug(`include patterns: ${JSON.stringify(config.patterns)}`)
    const op = new Operator(config.provider, config.options)
    core.startGroup(`Upload files to ${config.provider} start`)
    const pathSpec = await includeFiles(config.patterns)
    for (const spec of pathSpec) {
      core.debug(`upload file: ${spec.fsPath}`)
      core.info(`upload file: ${spec.path} tp ${spec.dir}`)
      // ensure the upload directory exists, relative path from search path
      if (spec.dir) {
        core.debug(`ensure the upload directory exists: ${spec.dir}`)
        await op.createDir(spec.dir)
      }
      // upload file
      await op.write(spec.path, fs.readFileSync(spec.fsPath))
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
