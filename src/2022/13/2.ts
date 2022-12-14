import IO from 'lib/io.js'

const io = new IO()

type Packet = Array<number | Packet>

function parse(input: string): Packet {
  const stack: Packet[] = []
  let last: Packet | undefined = undefined
  let n: number | undefined = undefined
  for (const c of input) {
    if (c === '[') {
      stack.push([])
    } else if (!isNaN(+c)) {
      n = (n ?? 0) * 10 + +c
    } else {
      if (n !== undefined) {
        stack[stack.length - 1]!.push(n)
        n = undefined
      }
      if (c === ']') {
        last = stack.pop()!
        stack[stack.length - 1]?.push(last)
      }
    }
  }
  return last!
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
  return res === undefined ? 0 : res ? -1 : 1
}

const packets: Packet[] = []
for await (const line of io.readLines()) {
  if (!line) continue
  packets.push(parse(line))
}
packets.push(div1)
packets.push(div2)
packets.sort(sortCompare)

const d1 = packets.indexOf(div1) + 1
const d2 = packets.indexOf(div2, d1) + 1

io.write(d1 * d2)
