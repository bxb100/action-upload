import * as core from '@actions/core'
import * as glob from '@actions/glob'
import path from 'node:path'

const patterSplit = (
  patterns: string[]
): { includes: string[]; excludes: string[] } => {
  const includes: string[] = []
  const excludes: string[] = []
  for (const pattern of patterns) {
    if (pattern.startsWith('!')) {
      excludes.push(pattern)
    } else {
      includes.push(pattern)
    }
  }
  return { includes, excludes }
}

/**
 * if we need upload `/local/path/to/file` when search `path/**`
 * - create directory `to/` in remote
 * - upload file to `to/file`
 *
 * case 1: specific search file
 * - direct upload file to `file`
 */
export declare interface PathSpec {
  file: string
  filename: string
  // unix style
  parentDir: string
  dest: string
}

export const includeFiles = async (patterns: string[]): Promise<PathSpec[]> => {
  const { includes, excludes } = patterSplit(patterns)
  // exclude must be set in the last
  const globber = await glob.create([...includes, ...excludes].join('\n'), {
    followSymbolicLinks: false,
    implicitDescendants: true,
    matchDirectories: false,
    omitBrokenSymbolicLinks: true
  })
  const searchPaths = globber.getSearchPaths()
  const paths: PathSpec[] = []

  for await (const file of globber.globGenerator()) {
    // exclude .DS_Store
    if (file.endsWith('.DS_Store')) {
      continue
    }
    const filename = path.basename(file)
    const fileDir = path.parse(file).dir
    for (const searchPath of searchPaths) {
      core.debug(`searchPath: ${searchPath}; file: ${file}`)
      if (!file.startsWith(searchPath)) {
        continue
      }
      let parentDir = fileDir.substring(searchPath.length + 1)
      if (parentDir) {
        // like webdav need the directory path end with '/'
        // is ok to replace all?
        parentDir = parentDir.replaceAll(/\\/g, '/')
        if (!parentDir.endsWith('/')) {
          // openDAL need the directory path end with '/'
          parentDir = parentDir + '/'
        }
      }
      paths.push({
        file,
        filename,
        parentDir,
        dest: (parentDir || '') + filename
      })
    }
  }
  return paths
}
