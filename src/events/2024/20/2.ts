import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'

const MAX_CHEAT_LEN = 20

const minSave = Number((await io.readLineIfMatch(/^min=(\d+)$/))?.[1] ?? 100)

// Parse map.
let start = 0
let end = 0
const map = new Uint8Matrix()
for await (const line of io.readLines()) {
  const s = line.indexOf('S')
  if (s >= 0) start = map.length + s
  const e = line.indexOf('E')
  if (e >= 0) end = map.length + e
  map.pushRow(line.split('').map((c) => +(c === '#')))
}
const dirs = [1, map.width, -1, -map.width]

// Determine path.
const eToSDist = new Uint32Array(map.length)
{
  eToSDist[end] = 1
  let pos = end
  while (pos !== start) {
    const dist = eToSDist[pos]! + 1
    for (const dir of dirs) {
      const next = pos + dir
      if (map.$[next]) continue
      if (eToSDist[next]) continue
      eToSDist[next] = dist
      pos = next
      break
    }
  }
}

// Determine shortcuts.
let shortcuts = 0
for (let pos = 0; pos < eToSDist.length; pos++) {
  const dist = eToSDist[pos]!
  if (!dist) continue
  const [posX, posY] = map.iToVec(pos)
  for (let dx = 0; dx <= MAX_CHEAT_LEN; dx++) {
    const dyAbsMax = MAX_CHEAT_LEN - dx
    for (let dy = -dyAbsMax; dy <= dyAbsMax; dy++) {
      if (!dx && dy < 0) continue
      const altX = posX + dx
      const altY = posY + dy
      if (!map.has(altX, altY)) continue
      const alt = map.vecToI(altX, altY)
      const altDist = eToSDist[alt]!
      if (!altDist) continue
      const cut = Math.abs(dist - altDist) - dx - Math.abs(dy)
      if (cut < minSave) continue
      shortcuts++
    }
  }
}

io.write(shortcuts)
