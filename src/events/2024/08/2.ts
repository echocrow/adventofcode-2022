import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import {
  addVec2,
  inAreaVec2,
  subtractVec2,
  Vec2Set,
  type vec2,
} from '#lib/vec2.js'

// Parse map.
const mapWidth = await io.peekLineLen()
const antennas: Record<string, vec2[]> = {}
let y = 0
for await (const line of io.readLines()) {
  for (let x = 0; x < line.length; x++) {
    const char = line[x]!
    if (char === '.') continue
    ;(antennas[char] ??= []).push([x, y])
  }
  y++
}
const mapStart: vec2 = [0, 0]
const mapEnd: vec2 = [mapWidth, y]

// Find anti-nodes.
const antiNodes = new Vec2Set()
for (const locations of Object.values(antennas)) {
  // Iterate over all pairs of antennas.
  for (const [a, b] of pairs(locations)) {
    for (let [pos, diff] of [
      [a, subtractVec2(a, b)],
      [b, subtractVec2(b, a)],
    ] as const) {
      while (inAreaVec2(mapStart, mapEnd, pos)) {
        antiNodes.add(pos)
        pos = addVec2(pos, diff)
      }
    }
  }
}

const result = antiNodes.size
io.write(result)
