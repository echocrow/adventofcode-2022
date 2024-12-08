import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import {
  addVec2,
  inAreaVec2,
  subtractVec2,
  Vec2Set,
  type vec2,
} from '#lib/vec2.v1.js'

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
    const diff = subtractVec2(b, a)
    // Check possible anti-nodes.
    for (const pos of [subtractVec2(a, diff), addVec2(b, diff)]) {
      if (inAreaVec2(mapStart, mapEnd, pos)) antiNodes.add(pos)
    }
  }
}

const result = antiNodes.size
io.write(result)
