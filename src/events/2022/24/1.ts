import io from '#lib/io.js'
import memoize from '#lib/memo.js'
import Queue from '#lib/queue.js'
import {
  addVec2,
  equalsVec,
  inAreaVec2,
  modVec2,
  scaleVec2,
  subtractVec2,
  type vec2,
  Vec2Set,
  zeroVec2,
} from '#lib/vec2.js'
import {type vec3, Vec3Set} from '#lib/vec3.js'

// Parse.
let mapW = 0
let mapH = 0
const srcBlizzards: Array<[pos: vec2, dir: vec2]> = []
const inputDirs: Record<string, vec2> = {
  '^': [0, -1],
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
}
for await (const line of io.readLines()) {
  if (!mapW) {
    mapW = line.length - 2
  } else if (!line.startsWith('##')) {
    const row = line.slice(1, -1)
    for (let x = 0; x < row.length; x++) {
      const dir = inputDirs[row[x]!]
      if (dir) srcBlizzards.push([[x, mapH], dir])
    }
    mapH++
  }
}
const mapSize: vec2 = [mapW, mapH]
const blizzardsCycle = mapW * mapH

// Get memoized blizzard locations at given time.
const getBlizzardsLocs = memoize((time: number) => {
  const locs = new Vec2Set()
  for (const [startPos, dir] of srcBlizzards)
    locs.add(modVec2(addVec2(startPos, scaleVec2(dir, time)), mapSize))
  return locs
})

// Find shortest time.
let resultTime: number = 0
const moves: readonly vec2[] = [
  [0, 1],
  [1, 0],
  [0, 0],
  [-1, 0],
  [0, -1],
]
const start: vec2 = [0, -1]
const end: vec2 = [mapW - 1, mapH]
const queue = new Queue<vec3>().enqueue(0, [0, ...start])
let visited = new Vec3Set()
search: for (const {item} of queue) {
  const [time, ...pos] = item
  const nextTime = time + 1
  const blizzardLocs = getBlizzardsLocs(nextTime % blizzardsCycle)
  for (const move of moves) {
    const to = addVec2(pos, move)
    const to3: vec3 = [nextTime, ...to]

    // Ensure we have not been here before at the same time.
    if (visited.has(to3)) continue
    visited.add(to3)

    // Ensure position is not taken by blizzard.
    if (blizzardLocs.has(to)) continue

    // Exit loop if exit path found.
    if (equalsVec(to, end)) {
      resultTime = nextTime
      break search
    }

    // Ensure position is still within playable area (or starting position)
    if (!inAreaVec2(zeroVec2, mapSize, to) && !equalsVec(to, start)) continue

    const dVec = subtractVec2(end, to)
    const dist = dVec[0] + dVec[1]
    queue.enqueue(nextTime + dist, to3)
  }
}

io.write(resultTime)
