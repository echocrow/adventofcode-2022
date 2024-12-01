import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

const left: number[] = []
const rightCounts: Record<number, number> = {}

for await (const line of io.readLines()) {
  const [l = 0, r = 0] = line.split(/\s+/, 2).map(Number)
  left.push(l)
  rightCounts[r] = (rightCounts[r] ?? 0) + 1
}

const result = sum(left.map((l) => l * (rightCounts[l] ?? 0)))

io.write(result)
