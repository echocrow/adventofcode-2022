import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import {unionInto} from '#lib/set.js'

const TOP_HEIGHT = 9

// Parse map.
const map = new Uint8Matrix()
const tops: number[] = []
for await (const line of io.readLines()) {
  const row = [...line].map((c) => +c)
  for (const [i, h] of row.entries()) {
    if (h === TOP_HEIGHT) tops.push(i + map.length)
  }
  map.pushRow(row)
}

class Path {
  constructor(
    public readonly pos: number,
    public readonly tops: Set<number>,
  ) {}
}

// BFS peak to base.
let paths = tops.map((p) => new Path(p, new Set([p])))
const queueIds = new Uint32Array(map.length)
for (let h = TOP_HEIGHT - 1; h >= 0; h--) {
  const newPaths: Path[] = []
  queueIds.fill(0)

  for (const {pos, tops} of paths) {
    for (const toPos of neighbors(map, pos)) {
      if (map.$[toPos] !== h) continue

      // Queue or updated already-queued path.
      const queueId = queueIds[toPos]! - 1
      if (queueId < 0) {
        queueIds[toPos] = newPaths.push(new Path(toPos, new Set(tops)))
      } else {
        unionInto(newPaths[queueId]!.tops, tops)
      }
    }
  }
  paths = newPaths
}

const result = sum(paths.map(({tops}) => tops.size))
io.write(result)
