import io from '#lib/io.js'

type Packet = Array<number | Packet>

function parse(input: string): Packet {
  return JSON.parse(input)
}

const div1 = parse('[[2]]')
const div2 = parse('[[6]]')

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

function sortCompare(left: Packet, right: Packet): number {
  const res = compare(left, right)
  return (
    res === undefined ? 0
    : res ? -1
    : 1
  )
}

const packets: Packet[] = []
for await (const line of io.readLines()) {
  if (line) packets.push(parse(line))
}
packets.push(div1)
packets.push(div2)
packets.sort(sortCompare)

const d1 = packets.indexOf(div1) + 1
const d2 = packets.indexOf(div2, d1) + 1

io.write(d1 * d2)
