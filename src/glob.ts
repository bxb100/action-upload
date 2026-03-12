import path from 'node:path'

import * as core from '@actions/core'
import * as glob from '@actions/glob'

export interface PathSpec {
  file: string
  filename: string
  /** Unix-style parent directory, always ends with '/' if non-empty */
  parentDir: string
  dest: string
}

function splitPatterns(patterns: string[]): {
  includes: string[]
  excludes: string[]
} {
  const includes: string[] = []
  const excludes: string[] = []
  for (const p of patterns) {
    ;(p.startsWith('!') ? excludes : includes).push(p)
  }
  return { includes, excludes }
}

/**
 * Normalize a relative directory path for remote use:
 * - Replace backslashes with forward slashes
 * - Ensure a trailing '/' (required by openDAL)
 */
function normalizeDir(dir: string): string {
  if (!dir) return ''
  const normalized = dir.replaceAll(/\\/g, '/')
  return normalized.endsWith('/') ? normalized : `${normalized}/`
}

/**
 * Resolve glob patterns into a list of {@link PathSpec} entries.
 *
 * For a file `/local/path/to/file` matched by pattern `path/**`:
 * - `parentDir` = `to/`
 * - `dest`      = `to/file`
 */
export async function includeFiles(patterns: string[]): Promise<PathSpec[]> {
  const { includes, excludes } = splitPatterns(patterns)

  // Excludes must come after includes in the joined pattern
  const globber = await glob.create([...includes, ...excludes].join('\n'), {
    followSymbolicLinks: false,
    implicitDescendants: true,
    matchDirectories: false,
    omitBrokenSymbolicLinks: true
  })

  const searchPaths = globber.getSearchPaths()
  const specs: PathSpec[] = []

  for await (const file of globber.globGenerator()) {
    if (file.endsWith('.DS_Store')) continue

    const filename = path.basename(file)
    const fileDir = path.dirname(file)

    for (const searchPath of searchPaths) {
      if (!file.startsWith(searchPath)) continue

      core.debug(`searchPath: ${searchPath}; file: ${file}`)

      const parentDir = normalizeDir(fileDir.substring(searchPath.length + 1))

      specs.push({ file, filename, parentDir, dest: `${parentDir}${filename}` })
    }
  }

  return specs
}
