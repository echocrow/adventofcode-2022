import {mkdir, open, readdir} from 'fs/promises'
import path from 'path'
import padNum from '../lib/padNum.js'

async function touch(filepath: string) {
  const fh = await open(filepath, 'a')
  await fh.close()
}

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

await Promise.all(
  ['input.txt', '1.ts', '2.ts'].map((name) =>
    touch(path.join(nextDayDir, name)),
  ),
)
