import {mkdir, readdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import padNum from 'lib/padNum.js'

const srcDir = path.resolve('./src')

const year = new Date().getFullYear()
const yearDir = path.join(srcDir, `${year}`)

const latestDay = (await readdir(yearDir, {withFileTypes: true}))
  .filter((e) => e.isDirectory())
  .map((e) => parseInt(e.name, 10))
  .reduce((m, n) => Math.max(m, n), 0)
const nextDay = latestDay + 1
const nextDayDir = path.join(yearDir, padNum(nextDay, 2))

await mkdir(nextDayDir)

const tpl = `
import IO from 'lib/io.js'

const io = new IO()

let result = 0
for await (const line of io.readLines()) {
  // todo
}

await io.write(result)
`.trimStart()

await Promise.all(
  ['1.ts', '2.ts'].map((name) => writeFile(path.join(nextDayDir, name), tpl)),
)
