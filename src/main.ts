import { readFile } from 'node:fs/promises'

import * as core from '@actions/core'
import { Operator, RetryLayer } from 'opendal'

import { Config } from './config'
import type { PathSpec } from './glob'
import { includeFiles } from './glob'

function createOperator(
  provider: string,
  options: Record<string, string>
): Operator {
  const retryLayer = new RetryLayer()
  retryLayer.jitter = true
  retryLayer.maxTimes = 4

  return new Operator(provider, options).layer(retryLayer.build())
}

async function uploadFile(
  op: Operator,
  spec: PathSpec,
  flatten: boolean
): Promise<void> {
  const content = await readFile(spec.file)

  if (flatten) {
    core.info(`direct upload file: ${spec.filename}`)
    await op.write(spec.filename, content)
    return
  }

  core.info(`upload file: ${spec.filename} to ${spec.dest}`)

  // Ensure the remote directory exists (relative path from search root)
  if (op.capability().createDir && spec.parentDir) {
    core.debug(`ensure the upload directory exists: ${spec.parentDir}`)
    await op.createDir(spec.parentDir)
  }

  await op.write(spec.dest, content)
}

export async function run(): Promise<Operator | undefined> {
  try {
    const config = new Config()

    core.debug(`provider: ${config.provider}`)
    core.debug(`provider options: ${JSON.stringify(config.options)}`)
    core.debug(`include patterns: ${JSON.stringify(config.patterns)}`)
    core.debug(`flatten: ${config.flatten}`)

    core.startGroup(`Upload files to ${config.provider} start`)

    const op = createOperator(config.provider, config.options)
    await op.check()

    const pathSpec = await includeFiles(config.patterns)
    core.debug(`path spec: ${JSON.stringify(pathSpec)}`)

    for (const spec of pathSpec) {
      core.debug(`upload file: ${spec.file}`)
      await uploadFile(op, spec, config.flatten)
    }

    core.endGroup()
    return op
  } catch (error) {
    core.error(`Upload files failed: ${error}`)
    core.setFailed('Upload files failed')
  }
}
