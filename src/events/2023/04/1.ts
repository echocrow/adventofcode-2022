import io from 'lib/io.js'

const numsRe = /\d+/g
function findNums(str: string) {
  return [...str.matchAll(numsRe)].map((m) => parseInt(m[0]))
}

let result = 0
for await (const line of io.readLines()) {
  const winNumsIdx = line.indexOf(':')
  const gotNumsIdx = line.indexOf('|')
  const winNums = new Set(findNums(line.slice(winNumsIdx, gotNumsIdx)))
  const gotNums = findNums(line.slice(gotNumsIdx))
  const matchCount = gotNums.filter((n) => winNums.has(n)).length
  if (matchCount) result += 2 ** (matchCount - 1)
}

io.write(result)
