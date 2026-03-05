import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  unbundle: false,
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node24',
  clean: false,
  deps: {
    neverBundle: [/^@opendal\//],
    alwaysBundle: [/.*/]
  }
})
