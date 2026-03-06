import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  unbundle: false,
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  clean: false,
  shims: true,
  banner: {
    js: 'var require;'
  },
  deps: {
    neverBundle: [/^@opendal\//],
    alwaysBundle: [/.*/]
  }
})
