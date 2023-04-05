import * as core from '@actions/core'
import * as fs from 'fs'
import {ConfigHelper} from './config-helper'
import {Operator} from 'opendal'
import {includeFiles} from './glob-helper'

export async function run(): Promise<void> {
  try {
    const config = new ConfigHelper()
    core.debug(`provider options: ${JSON.stringify(config.options)}`)
    core.debug(`include patterns: ${JSON.stringify(config.patterns)}`)
    core.startGroup(`Upload files to ${config.provider} start`)

    const op = new Operator(config.provider, config.options)
    const pathSpec = await includeFiles(config.patterns)
    core.debug(`path spec: ${JSON.stringify(pathSpec)}`)
    for (const spec of pathSpec) {
      core.debug(`upload file: ${spec.fsPath}`)
      core.info(`upload file: ${spec.path} to ${spec.dir}`)
      // ensure the upload directory exists, relative path from search path
      if (spec.dir) {
        core.debug(`ensure the upload directory exists: ${spec.dir}`)
        // openDAL need the directory path end with '/'
        let dir = spec.dir
        if (!dir.endsWith('/')) {
          dir = `${dir}/`
        }
        await op.createDir(dir)
      }
      // upload file
      await op.write(spec.path, fs.readFileSync(spec.fsPath))
    }
    core.endGroup()
  } catch (error) {
    core.error(`Upload files failed: ${error}`)
    core.setFailed('Upload files failed')
  }
}

run()
