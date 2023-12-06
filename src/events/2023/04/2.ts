import {allocArrLen as allocMinLen} from 'lib/array.js'
import io from 'lib/io.js'
import range from 'lib/range.js'

const numsRe = /\d+/g
function findNums(str: string) {
  return [...str.matchAll(numsRe)].map((m) => parseInt(m[0]))
}

let result = 0
let cardIdx = 0
let copies = new Uint32Array()
for await (const line of io.readLines()) {
  const id = cardIdx++
  const winNumsIdx = line.indexOf(':')
  const gotNumsIdx = line.indexOf('|')
  const winNums = new Set(findNums(line.slice(winNumsIdx, gotNumsIdx)))
  const gotNums = findNums(line.slice(gotNumsIdx))
  const matchCount = gotNums.filter((n) => winNums.has(n)).length

  const nextId = cardIdx
  const copyToId = nextId + matchCount
  copies = allocMinLen(copies, copyToId)
  const cardCounts = (copies[id] ?? 0) + 1
  for (const i of range(nextId, copyToId)) copies[i] += cardCounts
  result += cardCounts
}

io.write(result)
