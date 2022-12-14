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
for await (const line1 of io.readLines()) {
  if (!line1) continue
  const line2 = (await io.readLine()) ?? ''
  const p1 = parse(line1)
  const p2 = parse(line2)
  if (compare(p1, p2)) correct += i
  i++
}

io.write(correct)
