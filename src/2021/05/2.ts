import Counter from 'lib/counter.js'
import IO from 'lib/io.js'

const io = new IO()

function* range2d(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 > x2 ? -1 : +(x1 < x2)
  const dy = y1 > y2 ? -1 : +(y1 < y2)

  let x = x1
  let y = y1
  const steps = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2))
  for (let i = 0; i <= steps; i++) {
    yield [x, y]
    x += dx
    y += dy
  }
}

const re = /^(\d+),(\d+) -> (\d+),(\d+)$/

const dots = new Counter()
for await (const line of io.readLines()) {
  const rex = re.exec(line)?.slice(1).map(Number)
  if (!rex) throw 'invalid line'
  const [x1, y1, x2, y2] = rex as [number, number, number, number]
  for (const [x, y] of range2d(x1, y1, x2, y2)) {
    dots.inc(`${x}.${y}`)
  }
}

const overlaps = [...dots.values()].filter((c) => c >= 2).length

io.write(overlaps)
