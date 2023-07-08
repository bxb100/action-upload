import * as core from '@actions/core'
import * as fs from 'fs'
import {ConfigHelper} from './config-helper'
import {Operator} from 'opendal'
import {includeFiles} from './glob-helper'

export async function run(): Promise<Operator | undefined> {
  try {
    const config = new ConfigHelper()

    {
      // ATTENTION: the provider options may contain sensitive information
      core.debug(`provider options: ${JSON.stringify(config.options)}`)
      core.debug(`include patterns: ${JSON.stringify(config.patterns)}`)
      core.debug(`flatten: ${config.flatten}`)
    }

    core.startGroup(`Upload files to ${config.provider} start`)

    const op = new Operator(config.provider, config.options)
    const pathSpec = await includeFiles(config.patterns)
    core.debug(`path spec: ${JSON.stringify(pathSpec)}`)
    for (const spec of pathSpec) {
      core.debug(`upload file: ${spec.fsPath}`)

      if (config.flatten) {
        core.info(`direct upload file: ${spec.basename}`)
        await op.write(spec.basename, fs.readFileSync(spec.fsPath))
        continue
      }

      core.info(`upload file: ${spec.path} to ${spec.dir}`)
      // ensure the upload directory exists, relative path from search path
      if (spec.dir) {
        core.debug(`ensure the upload directory exists: ${spec.dir}`)
        await op.createDir(spec.dir)
      }
      // upload file
      await op.write(spec.path, fs.readFileSync(spec.fsPath))
    }
    core.endGroup()
    return op
  } catch (error) {
    core.error(`Upload files failed: ${error}`)
    core.setFailed('Upload files failed')
  }
}

run()
