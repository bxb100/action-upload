import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync
} from 'node:fs'
import { join } from 'node:path'

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    stdio: 'pipe',
    encoding: 'utf8',
    ...opts
  }).trim()
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function untar(tgzPath, destDir) {
  ensureDir(destDir)
  // tar -xzf xxx.tgz -C dest
  execFileSync('tar', ['-xzf', tgzPath, '-C', destDir], { stdio: 'inherit' })
}

function npmPack(spec, outDir) {
  ensureDir(outDir)
  const tgzName = sh('npm', ['pack', spec, '--pack-destination', outDir])
  return join(outDir, tgzName.split('\n').pop())
}

function clearDir(path) {
  rmSync(path, { recursive: true, force: true })
  ensureDir(path)
}

const VENDOR_TGZ = 'vendor-tgz'
const TMP = '.vendor-tmp'
const OUT_DIR = 'dist'

ensureDir(VENDOR_TGZ)
clearDir(TMP)

const opendalTgz = npmPack('opendal', VENDOR_TGZ)
clearDir(TMP)
untar(opendalTgz, TMP)

const opendalPkg = JSON.parse(
  readFileSync(join(TMP, 'package', 'package.json'), 'utf8')
)
const opt = opendalPkg.optionalDependencies ?? {}
const platformPkgs = Object.entries(opt).filter(([name]) =>
  name.startsWith('@opendal/lib-')
)

console.log(
  'Found platform packages:',
  platformPkgs.map(([n, v]) => `${n}@${v}`).join(', ')
)

for (const [name, ver] of platformPkgs) {
  const spec = `${name}@${ver}`
  // `@opendal/lib-darwin-x64@0.49.2` => `opendal-lib-darwin-x64-0.49.2.tgz`
  let tgz = join(
    VENDOR_TGZ,
    `${name.replace('/', '-').substring(1)}-${ver}.tgz`
  )
  if (existsSync(tgz)) {
    console.log(`Package ${spec} already exists in ${tgz}`)
  } else {
    tgz = npmPack(spec, VENDOR_TGZ)
  }

  clearDir(TMP)
  untar(tgz, TMP)

  let nodes = readdirSync(TMP, { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.node'))
    .map((f) => f.name)
  for (const node of nodes) {
    renameSync(join(TMP, 'package', node), join(OUT_DIR, node))
  }
}
clearDir(TMP)
console.log('✅ Vendoring done.')
