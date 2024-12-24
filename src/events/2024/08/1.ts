import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import vec, {Vec2Set, type Vec2} from '#lib/vec2.js'

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
const antiNodes = new Vec2Set()
for (const locations of Object.values(antennas)) {
  // Iterate over all pairs of antennas.
  for (const [a, b] of pairs(locations)) {
    const diff = b.subtract(a)
    // Check possible anti-nodes.
    for (const pos of [a.subtract(diff), b.add(diff)]) {
      if (pos.inArea(mapEnd)) antiNodes.add(pos)
    }
  }
}

const result = antiNodes.size
io.write(result)
