import io from '#lib/io.js'
import {filo} from '#lib/iterable.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'

const garden = new Uint8Matrix()
for await (const line of io.readLines())
  garden.pushRow([...line].map((c) => c.charCodeAt(0)))

let result = 0
const seen = new Uint8Array(garden.length)
for (const i of garden.$.keys()) {
  if (seen[i]) continue
  seen[i] = 1

  const plant = garden.$[i]

  // Flood-scan region & determine cost.
  let area = 0
  let dualLinks = 0
  const queue = [i]
  for (const i of filo(queue)) {
    area++
    for (const j of neighbors(garden, i)) {
      if (garden.$[j] !== plant) continue
      dualLinks++
      if (seen[j]) continue
      seen[j] = 1
      queue.push(j)
    }
  }

  const perim = area * 4 - dualLinks
  result += area * perim
}

io.write(result)
