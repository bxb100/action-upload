import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as os from 'os'

const patterSplit = (
  patterns: string[]
): {includes: string[]; excludes: string[]} => {
  const includes: string[] = []
  const excludes: string[] = []
  for (const pattern of patterns) {
    pattern.startsWith('!') ? excludes.push(pattern) : includes.push(pattern)
  }
  return {includes, excludes}
}

export declare interface PathSpec {
  dir: string
  path: string
  basename: string
  fsPath: string
}

export const includeFiles = async (patterns: string[]): Promise<PathSpec[]> => {
  const {includes, excludes} = patterSplit(patterns)
  // exclude must be set in the last
  const globber = await glob.create([...includes, ...excludes].join('\n'), {
    followSymbolicLinks: false,
    implicitDescendants: true,
    matchDirectories: false,
    omitBrokenSymbolicLinks: true
  })
  const searchPaths = globber.getSearchPaths()
  core.debug(`search paths: ${searchPaths}`)
  const paths: PathSpec[] = []
  let separate = '/'
  if (os.platform() === 'win32') {
    separate = '\\'
  }
  for await (const file of globber.globGenerator()) {
    // exclude .DS_Store
    if (file.endsWith('.DS_Store')) {
      continue
    }

    // according to the `@action/glob` rule, the getSearchPaths may return multiple
    for (const base of searchPaths) {
      core.debug(`base: ${base}; file: ${file}`)
      if (file.startsWith(base)) {
        let dir = file.substring(base.length, file.lastIndexOf(separate))
        if (dir) {
          // openDAL need the directory path end with '/'
          dir = `${dir}${separate}`
        }
        const basename = file.substring(file.lastIndexOf(separate) + 1)
        const path = file.substring(base.length + 1)
        paths.push({dir, path, basename, fsPath: file})
      }
    }
  }
  return paths
}
