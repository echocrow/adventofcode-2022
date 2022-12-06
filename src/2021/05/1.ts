import IO from 'lib/io.js'

const io = new IO()

class Counter<T> extends Map<T, number> {
  inc(key: T) {
    this.set(key, (this.get(key) ?? 0) + 1)
  }
}

function* range(from: number, to: number) {
  const d = from <= to ? 1 : -1
  for (let i = from; i !== to; i += d) {
    yield i
  }
  yield to
}

const re = /^(\d+),(\d+) -> (\d+),(\d+)$/

const dots = new Counter()
for await (const line of io.readLines()) {
  const rex = re.exec(line)?.slice(1).map(Number)
  if (!rex) throw 'invalid line'
  const [x1, y1, x2, y2] = rex as [number, number, number, number]
  if (x1 !== x2 && y1 !== y2) continue
  for (const x of range(x1, x2)) {
    for (const y of range(y1, y2)) {
      dots.inc(`${x}.${y}`)
    }
  }
}

const overlaps = [...dots.values()].filter((c) => c >= 2).length

io.write(overlaps)
