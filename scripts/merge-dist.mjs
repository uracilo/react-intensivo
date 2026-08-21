import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const out = join(root, 'dist-site')

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const copies = [
  ['demos/00-web-basica', join(out, '00')],
  ['demos/01-fundamentos/dist', join(out, '01')],
  ['demos/02-estado/dist', join(out, '02')],
  ['demos/03-datos/dist', join(out, '03')],
  ['demos/04-crud-router/dist', join(out, '04')],
  ['demos/05-taskflow/dist', join(out, '05')],
  ['slides', join(out, 'slides')],
  ['docs', join(out, 'docs')],
]

for (const [from, to] of copies) {
  mkdirSync(to, { recursive: true })
  cpSync(join(root, from), to, { recursive: true })
}

const landing = readFileSync(join(root, 'site', 'index.html'), 'utf8')
writeFileSync(join(out, 'index.html'), landing)
writeFileSync(
  join(out, '404.html'),
  '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=./"></head><body></body></html>',
)

console.log('Merged builds into dist-site/')
