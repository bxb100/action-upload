// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    json(),
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    commonjs()
  ],
  external: (id) => {
    if (id.endsWith('.node')) return true
    if (id === 'opendal') return true
    const builtins = ['fs', 'path', 'os', 'stream', 'url']
    return builtins.includes(id)
  }
}

export default config
