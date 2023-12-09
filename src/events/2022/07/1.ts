import io from '#lib/io.js'
import {bigSum} from '#lib/sum.js'

function* joinPaths(dirs: string[]) {
  yield '/'
  let path = ''
  for (const dir of dirs) {
    path += `/${dir}`
    yield path
  }
}

const zero = BigInt(0)
const cdPrefix = '$ cd '
const fileRe = /^\d+ [\w.]+$/

let pwd: string[] = []
const dirSizes = new Map<string, bigint>()
for await (const line of io.readLines()) {
  // Handle cd.
  if (line.startsWith(cdPrefix)) {
    const path = line.slice(cdPrefix.length)
    if (path === '/') pwd = []
    else if (path === '..') pwd.pop()
    else pwd.push(path)
  }
  // Handle file.
  else if (fileRe.test(line)) {
    const [sizeStr = ''] = line.split(' ', 1)
    const size = BigInt(sizeStr)
    for (const path of joinPaths(pwd)) {
      dirSizes.set(path, (dirSizes.get(path) ?? zero) + size)
    }
  }
}

const THRESHOLD = BigInt(100_000)
const total = bigSum([...dirSizes.values()].filter((s) => s <= THRESHOLD))

io.write(total.toString())
