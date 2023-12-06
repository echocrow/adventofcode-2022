import io from 'lib/io.js'

class MapCounter<K> extends Map<K, number> {
  add(key: K, delta: number) {
    const count = (this.get(key) ?? 0) + delta
    if (count) this.set(key, count)
    else this.delete(key)
  }
  inc(key: K) {
    this.add(key, 1)
  }
  dec(key: K) {
    this.add(key, -1)
  }
}

const SEQ_LEN = 4
function findStart(line: string): number {
  let buffer = new MapCounter<string>()
  let i = 0
  for (const c of line) {
    if (i >= SEQ_LEN) buffer.dec(line[i - SEQ_LEN] ?? '')
    buffer.inc(c)
    if (buffer.size === SEQ_LEN) return i
    i++
  }
  throw 'not found'
}

let starts: number[] = []
for await (const line of io.readLines()) {
  starts.push(findStart(line) + 1)
}

io.write(starts.join('\n'))
