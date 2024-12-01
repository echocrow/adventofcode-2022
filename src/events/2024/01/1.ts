import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

const left: number[] = []
const right: number[] = []

for await (const line of io.readLines()) {
  const [l = 0, r = 0] = line.split(/\s+/, 2).map(Number)
  left.push(l)
  right.push(r)
}

left.sort((a, b) => a - b)
right.sort((a, b) => a - b)

const result = sum(left.map((l, i) => Math.abs(l - right[i]!)))

io.write(result)
