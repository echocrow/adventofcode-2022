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
  const queue = [end]
  for (const pos of queue) {
    if (pos === start) break
    const step = eToSDist[pos]! + 1
    for (const dir of dirs) {
      const next = pos + dir
      if (map.$[next]) continue
      if (eToSDist[next] && eToSDist[next]! <= step) continue
      eToSDist[next] = step
      queue.push(next)
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
  const dxMin = Math.max(-MAX_CHEAT_LEN, -posX)
  const dxMax = Math.min(MAX_CHEAT_LEN, map.width - posX - 1)
  for (let dx = dxMin; dx <= dxMax; dx++) {
    const dxAbsMax = MAX_CHEAT_LEN - Math.abs(dx)
    const dyMin = Math.max(-dxAbsMax, -posY)
    const dyMax = Math.min(dxAbsMax, map.height - posY - 1)
    for (let dy = dyMin; dy <= dyMax; dy++) {
      const alt = map.vecToI(posX + dx, posY + dy)
      const altDist = eToSDist[alt]!
      if (!altDist) continue
      const cut = dist - altDist - Math.abs(dx) - Math.abs(dy)
      if (cut < minSave) continue
      shortcuts++
    }
  }
}

io.write(shortcuts)
