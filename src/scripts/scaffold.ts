import {mkdir, readdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import padNum from 'lib/padNum.js'
import {parseArgs} from 'node:util'

const args = parseArgs({allowPositionals: true})
let [yearDir = `${new Date().getFullYear()}`, dayDir = ''] = args.positionals

const srcDir = path.resolve('./src/events')

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

const tpl = `
import io from 'lib/io.js'

let result = 0
for await (const line of io.readLines()) {
  // todo
}

io.write(result)
`.trimStart()

await Promise.all(
  ['1.ts', '2.ts'].map((name) => writeFile(path.join(dir, name), tpl)),
)

console.log(`Scaffolded [${path.relative(srcDir, dir)}/].`)
