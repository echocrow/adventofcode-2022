import io from 'lib/io.js'
import {joinRegExp} from 'lib/regexp.js'

type Packet = Array<number | Packet>

function parse(input: string): Packet {
  return JSON.parse(input)
}

function compare(left: Packet, right: Packet): boolean | undefined {
  const max = Math.max(left.length, right.length)
  for (let i = 0; i < max; i++) {
    const l = left[i]
    const r = right[i]
    if (l === undefined || r === undefined) return l === undefined
    if (typeof l === 'number' && typeof r === 'number') {
      if (l !== r) return l < r
    } else {
      const sub = compare(
        typeof l === 'number' ? [l] : l,
        typeof r === 'number' ? [r] : r,
      )
      if (sub !== undefined) return sub
    }
  }
  return undefined
}

let correct = 0
let i = 1
const lineReg = /\[.*\]/
const pairReg = joinRegExp([lineReg, lineReg], '\n')
for await (const [pair] of io.readRegExp(pairReg)) {
  const [p1, p2] = pair.split('\n').map(parse)
  if (compare(p1!, p2!)) correct += i
  i++
}

io.write(correct)
