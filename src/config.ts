import * as core from '@actions/core'

function stripQuotes(value: string): string {
  for (const q of ['"', "'"]) {
    if (value.startsWith(q) && value.endsWith(q)) {
      return value.slice(1, -1)
    }
  }
  return value
}

function parseKeyValueLines(lines: string[]): Record<string, string> {
  return Object.fromEntries(
    lines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .filter((line) => !line.startsWith('=') && !line.endsWith('='))
      .filter((line) => line.includes('='))
      .map((line) => stripQuotes(line))
      .map((line) => {
        const eqIndex = line.indexOf('=')
        return [line.slice(0, eqIndex).trim(), line.slice(eqIndex + 1).trim()]
      })
  )
}

export class Config {
  readonly provider: string
  readonly options: Record<string, string>
  readonly patterns: string[]
  readonly flatten: boolean

  constructor() {
    this.provider = core
      .getInput('provider', { required: true, trimWhitespace: true })
      .toLowerCase()

    this.options = parseKeyValueLines(
      core.getMultilineInput('provider_options', { required: false })
    )

    this.patterns = core
      .getMultilineInput('include', { required: true, trimWhitespace: true })
      .map(stripQuotes)

    this.flatten = core.getBooleanInput('flatten', { required: false })
  }
}
