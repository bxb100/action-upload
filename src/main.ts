import * as fs from 'fs'

import * as core from '@actions/core'
import { Operator, RetryLayer } from 'opendal'

import { ConfigHelper } from './config-helper'
import { includeFiles } from './glob-helper'

export async function run(): Promise<Operator | undefined> {
  try {
    const config = new ConfigHelper()

    {
      // ATTENTION: the provider options may contain sensitive information
      core.debug(`provider: ${config.provider}`)
      core.debug(`provider options: ${JSON.stringify(config.options)}`)
      core.debug(`include patterns: ${JSON.stringify(config.patterns)}`)
      core.debug(`flatten: ${config.flatten}`)
    }

    core.startGroup(`Upload files to ${config.provider} start`)

    let op = new Operator(config.provider, config.options)
    const retryLayer = new RetryLayer()
    retryLayer.jitter = true
    retryLayer.maxTimes = 4
    op = op.layer(retryLayer.build())
    await op.check()

    const pathSpec = await includeFiles(config.patterns)
    core.debug(`path spec: ${JSON.stringify(pathSpec)}`)
    for (const spec of pathSpec) {
      core.debug(`upload file: ${spec.file}`)

      if (config.flatten) {
        core.info(`direct upload file: ${spec.filename}`)
        await op.write(spec.filename, fs.readFileSync(spec.file))
        continue
      }

      core.info(`upload file: ${spec.filename} to ${spec.dest}`)
      // ensure the upload directory exists, relative path from search path
      if (op.capability().createDir && spec.parentDir) {
        core.debug(`ensure the upload directory exists: ${spec.parentDir}`)
        await op.createDir(spec.parentDir)
      }
      // upload file
      await op.write(spec.dest, fs.readFileSync(spec.file))
    }
    core.endGroup()
    return op
  } catch (error) {
    core.error(`Upload files failed: ${error}`)
    core.setFailed('Upload files failed')
  }
}
