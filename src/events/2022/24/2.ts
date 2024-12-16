import io from '#lib/io.js'
import memoize from '#lib/memo.js'
import {PriorityQueue} from '#lib/queue.js'
import {strRec} from '#lib/types.js'
import vec, {VecSet, type Vec2} from '#lib/vec.js'

// Parse.
let mapW = 0
let mapH = 0
const srcBlizzards: Array<[pos: Vec2, dir: Vec2]> = []
const inputDirs = strRec({
  '^': vec(0, -1),
  '>': vec(1, 0),
  v: vec(0, 1),
  '<': vec(-1, 0),
})
for await (const line of io.readLines()) {
  if (!mapW) {
    mapW = line.length - 2
  } else if (!line.startsWith('##')) {
    const row = line.slice(1, -1)
    for (let x = 0; x < row.length; x++) {
      const dir = inputDirs[row[x]!]
      if (dir) srcBlizzards.push([vec(x, mapH), dir])
    }
    mapH++
  }
}
const mapSize = vec(mapW, mapH)
const blizzardsCycle = mapW * mapH

// Get memoized blizzard locations at given time.
const getBlizzardsLocs = memoize((time: number) => {
  const locs = new VecSet()
  for (const [startPos, dir] of srcBlizzards)
    locs.add(startPos.add(dir.scale(time)).mod(mapSize))
  return locs
})

// Find shortest time.
const moves: readonly Vec2[] = [
  vec(0, 1),
  vec(1, 0),
  vec(0, 0),
  vec(-1, 0),
  vec(0, -1),
]
function findShortestTime(start: Vec2, end: Vec2, startTime: number) {
  const queue = new PriorityQueue<readonly [time: number, pos: Vec2]>().enqueue(
    startTime,
    [startTime, start],
  )
  let visited = new VecSet()
  for (const {item} of queue) {
    const [time, pos] = item
    const nextTime = time + 1
    const blizzardLocs = getBlizzardsLocs(nextTime % blizzardsCycle)
    for (const move of moves) {
      const to = pos.add(move)

      // Ensure we have not been here before at the same time.
      const to3 = vec(nextTime, to[0], to[1])
      if (visited.has(to3)) continue
      visited.add(to3)

      // Ensure position is not taken by blizzard.
      if (blizzardLocs.has(to)) continue

      // Exit loop if exit path found.
      if (to.equals(end)) return nextTime

      // Ensure position is still within playable area (or starting position)
      if (!to.inArea(mapSize) && !to.equals(start)) continue

      const dVec = end.subtract(to)
      const dist = dVec[0] + dVec[1]
      queue.enqueue(nextTime + dist, [nextTime, to])
    }
  }
  return -1
}

const startTime = performance.now()
const start = vec(0, -1)
const end = vec(mapW - 1, mapH)
const trip1 = findShortestTime(start, end, 0)
const trip2 = findShortestTime(end, start, trip1)
const trip3 = findShortestTime(start, end, trip2)
const endTime = performance.now()
io.log(`Elapsed time: ${Math.round(endTime - startTime)} milliseconds`)

io.write(trip3)
