import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  unbundle: false,
  outDir: 'dist',
  format: 'cjs',
  platform: 'node',
  target: 'node24',
  clean: false,
  shims: true,
  deps: {
    neverBundle: [/^@opendal\//],
    alwaysBundle: [/.*/]
  }
})
