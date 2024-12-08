import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import vec, {VecSet, type Vec2} from '#lib/vec.js'

// Parse map.
const mapWidth = await io.peekLineLen()
const antennas: Record<string, Vec2[]> = {}
let y = 0
for await (const line of io.readLines()) {
  for (let x = 0; x < line.length; x++) {
    const char = line[x]!
    if (char === '.') continue
    ;(antennas[char] ??= []).push(vec(x, y))
  }
  y++
}
const mapEnd = vec(mapWidth, y)

// Find anti-nodes.
const antiNodes = new VecSet()
for (const locations of Object.values(antennas)) {
  // Iterate over all pairs of antennas.
  for (const [a, b] of pairs(locations)) {
    for (let [pos, diff] of [
      [a, a.subtract(b)],
      [b, b.subtract(a)],
    ] as const) {
      while (pos.inArea(mapEnd)) {
        antiNodes.add(pos)
        pos = pos.add(diff)
      }
    }
  }
}

const result = antiNodes.size
io.write(result)
