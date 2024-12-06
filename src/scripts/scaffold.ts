import {copyFile, mkdir, readdir} from 'node:fs/promises'
import path from 'node:path'
import {parseArgs} from 'node:util'
import {padNum} from '#lib/string.js'

const args = parseArgs({allowPositionals: true})
let [yearDir = `${new Date().getFullYear()}`, dayDir = ''] = args.positionals

const srcDir = path.resolve('./src/events')
const tplDir = path.join(__dirname, 'templates')

const yearPath = path.join(srcDir, yearDir)
await mkdir(yearPath, {recursive: true})

if (!dayDir) {
  const latestDay = (await readdir(yearPath, {withFileTypes: true}))
    .filter((e) => e.isDirectory())
    .map((e) => parseInt(e.name, 10))
    .reduce((m, n) => Math.max(m, n), 0)
  const nextDay = latestDay + 1
  dayDir = padNum(nextDay, 2)
}

const dir = path.join(yearPath, dayDir)
await mkdir(dir, {recursive: true})

const fileCopies = [
  ['1.ts', path.join(tplDir, 'part.ts.tpl')],
  ['2.ts', path.join(tplDir, 'part.ts.tpl')],
  ['test.ts', path.join(tplDir, 'partTest.ts.tpl')],
] as const

await Promise.all(
  fileCopies.map(([name, tplPath]) => copyFile(tplPath, path.join(dir, name))),
)

console.log(`Scaffolded [${path.relative(srcDir, dir)}/].`)
