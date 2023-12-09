import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {addVec2, inAreaVec2, scaleVec2, type vec2, zeroVec2} from '#lib/vec2.js'

// Directions, going clockwise.
enum Dir {
  U,
  R,
  D,
  L,
}
const dirVec2s = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const satisfies Record<Dir, vec2>
function capDir(dir: Dir): Dir {
  return posMod(dir, dirVec2s.length)
}

// Faces of a cube, no particular order.
enum Face {
  U,
  F,
  D,
  B,
  L,
  R,
}

/**
 * Map of cube mesh face connections on a standard "t" mesh.
 *
 *                 ┌─────┐
 *   ┌─┐          ┌─┐    │
 *   │U│    >    ┌│U│┐   │
 * ┌─┼─┼─┐      ┌─┼─┼─┐  │
 * │L│F│R│  >  ┌│L│F│R│┐ │
 * └─┼─┼─┘     │└─┼─┼─┘│ │
 *   │D│    >  │ └│D│┘ │ │
 *   ├─┤       │  ├─┤  │ │
 *   │B│    >  └──│B│──┘ │
 *   └─┘          └─┘    │
 *                 └─────┘
 *
 * - Pick a face (U/F/D/B/L/R)
 * - Pick an edge to pass over (U/R/D/L)
 * - Result is the new face, and its rotation relative to the starting face.
 *
 * Examples:
 * - From face U, passing its D edge lands you on [F, same rotation]
 * - From face D, passing its R edge lands you on [R, rotated left]
 * - From face L, passing its L edge lands you on [B, rotated upside-down]
 */
const faceConnections = [
  // Side.U:
  [
    [Face.B, Dir.U],
    [Face.R, Dir.R],
    [Face.F, Dir.U],
    [Face.L, Dir.L],
  ],
  // Side.F:
  [
    [Face.U, Dir.U],
    [Face.R, Dir.U],
    [Face.D, Dir.U],
    [Face.L, Dir.U],
  ],
  // Side.D:
  [
    [Face.F, Dir.U],
    [Face.R, Dir.L],
    [Face.B, Dir.U],
    [Face.L, Dir.R],
  ],
  // Side.B:
  [
    [Face.D, Dir.U],
    [Face.R, Dir.D],
    [Face.U, Dir.U],
    [Face.L, Dir.D],
  ],
  // Side.L:
  [
    [Face.U, Dir.R],
    [Face.F, Dir.U],
    [Face.D, Dir.L],
    [Face.B, Dir.D],
  ],
  // Side.R:
  [
    [Face.U, Dir.L],
    [Face.B, Dir.D],
    [Face.D, Dir.R],
    [Face.F, Dir.U],
  ],
] as const

enum Cell {
  Void,
  Free,
  Wall,
}

// Parse map.
const [mapContents = '', instContents = ''] = (await io.readFile()).split(
  '\n\n',
)
const mapLines = mapContents.split('\n')

// Fill map.
const _mapWidth = Math.max(...mapLines.map((l) => l.length))
const map = new Uint8Matrix(
  mapLines.flatMap((line) =>
    line
      .padEnd(_mapWidth, ' ')
      .split('')
      .map((c) =>
        c === '#' ? Cell.Wall
        : c === '.' ? Cell.Free
        : 0,
      ),
  ),
  _mapWidth,
)

// Parse map layout.
const mapTileLen = Math.sqrt((map.width * map.height) / 12)
const meshWidth = map.width / mapTileLen
const meshHeight = map.height / mapTileLen
const meshFaces = (() => {
  type AngledSide = readonly [Face, Dir]
  type IAS = Readonly<AngledSide | undefined>
  type MeshFaces = [IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS]
  const meshFaces = Array(12).fill(undefined) as MeshFaces

  const upFacePos: vec2 = [
    map.findIndex((c) => c !== Cell.Void) / mapTileLen,
    0,
  ]

  const meshQueue: [vec2, AngledSide][] = [[upFacePos, [Face.U, Dir.U]]]
  let meshQueueItem: [vec2, AngledSide] | undefined
  while ((meshQueueItem = meshQueue.pop())) {
    const [pos, [face, dir]] = meshQueueItem
    const meshI = pos[1] * meshWidth + pos[0]
    if (meshFaces[meshI]) continue
    meshFaces[meshI] = [face, dir]
    for (const [goDir, goPos] of dirVec2s.entries()) {
      const toMeshPos = addVec2(pos, goPos)
      const toMapPos = scaleVec2(toMeshPos, mapTileLen)
      if (!inAreaVec2(zeroVec2, map.dims, toMapPos)) continue
      if (map.cell(toMapPos[0], toMapPos[1]) === Cell.Void) continue
      const exitDir = capDir(goDir - dir)
      const [toFace, dDir] = faceConnections[face][exitDir]
      meshQueue.push([toMeshPos, [toFace, capDir(dir - dDir)]])
    }
  }
  return meshFaces
})()

// Parse actions.
type Turn = 'R' | 'L'
type Action = number | Turn
const actions: Action[] = [...instContents.matchAll(/(?:[\d]+|R|L)/g)].map(
  ([match]) => {
    const moves = Number(match)
    return !isNaN(moves) ? moves : (match as Turn)
  },
)

// Handle movement.
function mapToMesh(i: number): number {
  let [x, y] = map.iToVec(i)
  const meshX = Math.floor((x / map.width) * meshWidth)
  const meshY = Math.floor((y / map.height) * meshHeight)
  return meshY * meshWidth + meshX
}
function meshToMap(i: number): number {
  const meshX = i % meshWidth
  const meshY = (i - meshX) / meshWidth
  const x = (meshX / meshWidth) * map.width
  const y = (meshY / meshHeight) * map.height
  return y * map.width + x
}
function flipTileVec([x, y]: vec2, dir: Dir): vec2 {
  const horizontal = dir === Dir.L || dir === Dir.R
  return horizontal ? [mapTileLen - 1 - x, y] : [x, mapTileLen - 1 - y]
}
function rotateTileVec([x, y]: vec2, angle: Dir): vec2 {
  for (let r = 0; r < angle; r++) [x, y] = [mapTileLen - 1 - y, x]
  return [x, y]
}
function crossEdge(from: number, angle: Dir): readonly [number, Dir] {
  let [x, y] = map.iToVec(from)
  // Find current mesh.
  const fromMesh = mapToMesh(from)
  const [fromFace, fromFaceAngle] = meshFaces[fromMesh]!
  // Find next face.
  const normalAngle: Dir = capDir(angle - fromFaceAngle)
  const [toFace, toFaceAngle] = faceConnections[fromFace][normalAngle]
  // Map next face to mesh.
  const toMeshI = meshFaces.findIndex((s) => s && s[0] === toFace)!
  const toMeshAngle = meshFaces[toMeshI]![1]
  const dAngle = capDir(-fromFaceAngle + toMeshAngle + toFaceAngle)
  // Map next mesh to map.
  const exitTileVec: vec2 = [x % mapTileLen, y % mapTileLen]
  const [enterTileX, enterTileY] = rotateTileVec(
    flipTileVec(exitTileVec, angle),
    dAngle,
  )
  const to = meshToMap(toMeshI) + enterTileY * map.width + enterTileX
  const toAngle: Dir = capDir(angle + dAngle)
  return [to, toAngle]
}
function step(from: number, angle: Dir): readonly [number, Dir] {
  let to = map.moveBy(from, dirVec2s[angle])
  let toAngle = angle
  if (to < 0 || !map[to]) [to, toAngle] = crossEdge(from, angle)
  const toCell = map[to]
  return toCell === Cell.Free ? [to, toAngle] : [from, angle]
}

// Move.
let pos = map.findIndex((c) => c === Cell.Free)
let angle: Dir = Dir.R
for (const action of actions) {
  // Handle rotation.
  if (typeof action === 'string') {
    angle = capDir(angle + (action === 'R' ? Dir.R : Dir.L))
  }
  // Handle step.
  else {
    for (let m = 0; m < action; m++) {
      const [nextPos, nextAngle] = step(pos, angle)
      if (nextPos === pos) break
      pos = nextPos
      angle = nextAngle
    }
  }
}

const [endX, endY] = map.iToVec(pos)
const result = (endX + 1) * 4 + (endY + 1) * 1000 + capDir(angle - 1)

io.write(result)
