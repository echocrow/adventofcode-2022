import io from 'lib/io.js'

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

const TOTAL_SPACE = BigInt(70_000_000)
const THRESHOLD = BigInt(30_000_000)

const usedSpace = dirSizes.get('/') ?? zero
const neededSpace = THRESHOLD - (TOTAL_SPACE - usedSpace)

const maxOkDirSize = [...dirSizes.values()].reduce(
  (max, size) => (size >= neededSpace && size < max ? size : max),
  TOTAL_SPACE,
)

io.write(maxOkDirSize.toString())
