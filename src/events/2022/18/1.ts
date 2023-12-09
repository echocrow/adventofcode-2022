import {entries} from '#lib/array.js'
import io from '#lib/io.js'
import {fmtVec3, neighborsVec3, type vec3} from '#lib/vec3.js'

type Cube = {
  p: vec3
  ns: [Neigbor, Neigbor, Neigbor, Neigbor, Neigbor, Neigbor]
}
type Neigbor = Cube | null

// Parse.
const cubes = new Map<string, Cube>()
for await (const line of io.readLines()) {
  const [x = 0, y = 0, z = 0] = line.split(',').map(Number)
  const p: vec3 = [x, y, z]
  cubes.set(fmtVec3(p), {p, ns: [null, null, null, null, null, null]})
}

// Connect neighbors.
for (const cube of cubes.values()) {
  for (const [ni, n] of entries(neighborsVec3(cube.p))) {
    const nc = cubes.get(fmtVec3(n))
    if (nc) cube.ns[ni] = nc
  }
}

const exposedSides = [...cubes.values()]
  .flatMap((c) => c.ns)
  .filter((nc) => !nc).length

io.write(exposedSides)
