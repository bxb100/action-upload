import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  root: 'src',
  unbundle: false,
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  clean: false,
  shims: true,
  minify: false,
  banner: {
    js: 'var require;'
  },
  deps: {
    neverBundle: [/^@opendal\/lib-/],
    alwaysBundle: [/.*/]
  }
})
