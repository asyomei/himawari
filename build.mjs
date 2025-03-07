import { cp, rm } from 'node:fs/promises'
import { build } from 'esbuild'

await rm('dist', { recursive: true, force: true })

await build({
  entryPoints: ['src/main.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  keepNames: true,
  format: 'esm',
  target: 'node22',
  platform: 'node',
  outExtension: { '.js': '.mjs' },
  banner: {
    js: [
      'import { createRequire } from "node:module";',
      'var require = createRequire(import.meta.dirname);',
    ].join('\n'),
  },
})

await cp('assets', 'dist/assets', { recursive: true })
