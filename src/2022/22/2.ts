import IO from 'lib/io.js'
import {posMod} from 'lib/math.js'
import {Uint8Matrix} from 'lib/matrix.js'
import type {vec2} from 'lib/vec2.js'

const io = new IO()

// Directions, going clockwise.
enum Dir {
  U,
  R,
  D,
  L,
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

// Shape and orientation of the input mesh is static. Could add more code to
// auto-detect, but this'll do just fine.
type AngledSide = readonly [Face, Dir]
type IAS = Readonly<AngledSide | undefined>
type InputMesh = Readonly<{
  faces: [IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS, IAS]
  width: 2 | 3 | 4 | 6
}>
const meshes = {
  sample: {
    faces: [
      undefined,
      undefined,
      [Face.U, Dir.U],
      undefined,
      [Face.B, Dir.D],
      [Face.L, Dir.U],
      [Face.F, Dir.U],
      undefined,
      undefined,
      undefined,
      [Face.D, Dir.U],
      [Face.R, Dir.R],
    ],
    width: 4,
  },
  input: {
    faces: [
      undefined,
      [Face.U, Dir.U],
      [Face.R, Dir.L],
      undefined,
      [Face.F, Dir.U],
      undefined,
      [Face.L, Dir.L],
      [Face.D, Dir.U],
      undefined,
      [Face.B, Dir.R],
      undefined,
      undefined,
    ],
    width: 3,
  },
} satisfies Record<string, InputMesh>

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
const mapWidth = Math.max(...mapLines.map((l) => l.length))

// Determine sample vs input mesh.
const mesh = mapWidth <= 16 ? meshes.sample : meshes.input
const meshHeight = mesh.faces.length / mesh.width
const mapTileLen = mapWidth / mesh.width

// Fill map.
const map = new Uint8Matrix(
  mapLines.flatMap((line) =>
    line
      .padEnd(mapWidth, ' ')
      .split('')
      .map((c) => (c === '#' ? Cell.Wall : c === '.' ? Cell.Free : 0)),
  ),
  mapWidth,
)

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
const dirVec2s: Readonly<Record<Dir, vec2>> = {
  [Dir.R]: [1, 0],
  [Dir.L]: [-1, 0],
  [Dir.U]: [0, -1],
  [Dir.D]: [0, 1],
}
function capDir(dir: Dir): Dir {
  return posMod(dir, 4)
}
function mapToMesh(i: number): number {
  let [x, y] = map.iToVec(i)
  const meshX = Math.floor((x / map.width) * mesh.width)
  const meshY = Math.floor((y / map.height) * meshHeight)
  return meshY * mesh.width + meshX
}
function meshToMap(i: number): number {
  const meshX = i % mesh.width
  const meshY = (i - meshX) / mesh.width
  const x = (meshX / mesh.width) * map.width
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
  const [fromFace, fromFaceAngle] = mesh.faces[fromMesh]!
  // Find next face.
  const normalAngle: Dir = capDir(angle - fromFaceAngle)
  const [toFace, toFaceAngle] = faceConnections[fromFace][normalAngle]
  // Map next face to mesh.
  const toMesh = mesh.faces.findIndex((s) => s && s[0] === toFace)!
  const toMeshAngle = mesh.faces[toMesh]![1]
  const dAngle = capDir(-fromFaceAngle + toMeshAngle + toFaceAngle)
  // Map next mesh to map.
  const exitTileVec: vec2 = [x % mapTileLen, y % mapTileLen]
  const [enterTileX, enterTileY] = rotateTileVec(
    flipTileVec(exitTileVec, angle),
    dAngle,
  )
  const to = meshToMap(toMesh) + enterTileY * map.width + enterTileX
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
