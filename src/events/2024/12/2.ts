import io from '#lib/io.js'
import {entries, filo, sum} from '#lib/iterable.js'
import {neighbors, Uint16Matrix, Uint8Matrix} from '#lib/matrix.js'

const srcGarden = new Uint8Matrix()
for await (const line of io.readLines())
  srcGarden.pushRow(line.split('').map((c) => c.charCodeAt(0)))

// Flood-scan regions & count sizes.
const garden = new Uint16Matrix(srcGarden.length, srcGarden.width)
const regionSizes: number[] = []
{
  const seen = new Uint8Array(srcGarden.length)
  for (const i of garden.$.keys()) {
    if (seen[i]) continue
    seen[i] = 1

    const id = regionSizes.length + 1
    const plant = srcGarden.$[i]

    let area = 0
    const queue = [i]
    for (const i of filo(queue)) {
      area++
      garden.$[i] = id
      for (const j of neighbors(srcGarden, i)) {
        if (srcGarden.$[j] !== plant) continue
        if (seen[j]) continue
        seen[j] = 1
        queue.push(j)
      }
    }

    regionSizes.push(area)
  }
}

// Count (beginnings of) vertical sides.
const regionVSides = new Uint16Array(regionSizes.length)
const prev = new Uint16Array((garden.width + 1) * 2)
for (let y = 0; y < garden.height; y++) {
  for (let x = 0; x <= garden.width; x++) {
    const l = garden.cell(x - 1, y) ?? 0
    const r = garden.cell(x, y) ?? 0
    const isSide = l !== r
    const wx = x * 2
    if (l && isSide && prev[wx + 0] !== l) regionVSides[l - 1]!++
    if (r && isSide && prev[wx + 1] !== r) regionVSides[r - 1]!++
    prev[wx + 0] = isSide ? l : 0
    prev[wx + 1] = isSide ? r : 0
  }
}

const result = sum(
  entries(regionSizes).map(([i, size]) => size * regionVSides[i]! * 2),
)
io.write(result)
