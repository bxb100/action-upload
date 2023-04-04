import * as core from '@actions/core'

export class ConfigHelper {
  private readonly _provider: string
  private readonly _options: Record<string, string>
  private readonly _patterns: string[]

  constructor() {
    // provider
    this._provider = core.getInput('provider', {
      required: true,
      trimWhitespace: true
    })
    // provider options
    this._options = {}
    const provider_options = core
      .getMultilineInput('provider_options', {
        required: false
      })
      .filter((option: string) => option !== '')
    for (const option of provider_options) {
      const [key, value] = option.split('=')
      this._options[key] = value
    }
    // include file patterns
    this._patterns = core.getMultilineInput('include', {
      required: true,
      trimWhitespace: true
    })
  }

  get provider(): string {
    return this._provider
  }

  get options(): Record<string, string> {
    return this._options
  }

  get patterns(): string[] {
    return this._patterns
  }
}
