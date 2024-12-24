import Counter from '#lib/counter.js'
import io from '#lib/io.js'
import vec2 from '#lib/vec2.js'

const re = /^(\d+),(\d+) -> (\d+),(\d+)$/

const dots = new Counter()
for await (const line of io.readLines()) {
  const rex = re.exec(line)?.slice(1).map(Number)
  if (!rex) throw 'invalid line'
  const [x1, y1, x2, y2] = rex
  for (const [x, y] of vec2(x1, y1).range(vec2(x2, y2), true)) {
    dots.inc(`${x}.${y}`)
  }
}

const overlaps = [...dots.values()].filter((c) => c >= 2).length

io.write(overlaps)
