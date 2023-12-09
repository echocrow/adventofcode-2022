import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'

enum Cell {
  Void,
  Free,
  Wall,
}

// Parse.
const [mapContents = '', instContents = ''] = (await io.readFile()).split(
  '\n\n',
)
const mapLines = mapContents.split('\n')
const mapWidth = Math.max(...mapLines.map((l) => l.length)) + 2
const mapHeight = mapLines.length + 2

// Fill map.
const map = new Uint8Matrix(mapWidth * mapHeight, mapWidth)
const edgesX = new Uint8Array(map.height * 2)
const edgesY = new Uint8Array(map.width * 2)
for (let y = 1; y <= mapLines.length; y++) {
  const mapLine = mapLines[y - 1]!
  let first = 0
  let last = 0
  for (let x = 1; x <= mapLine.length; x++) {
    const cell = mapLine[x - 1]!
    if (cell === ' ') continue
    if (!first) first = x
    last = x
    map.setCell(x, y, cell === '#' ? Cell.Wall : Cell.Free)
  }
  // Set horizontal teleports.
  edgesX[y * 2] = last
  edgesX[y * 2 + 1] = first
}
// Set vertical teleports.
for (let x = 1; x < map.width - 1; x++) {
  let first = 0
  let last = 0
  for (let y = 1; y < map.height - 1; y++) {
    const cell = map.cell(x, y)
    if (!cell) continue
    if (!first) first = y
    last = y
  }
  edgesY[x * 2] = last
  edgesY[x * 2 + 1] = first
}

// Collect actions.
type Turn = 'R' | 'L'
type Action = number | Turn
const actions: Action[] = [...instContents.matchAll(/(?:[\d]+|R|L)/g)].map(
  ([match]) => {
    const moves = Number(match)
    return !isNaN(moves) ? moves : (match as Turn)
  },
)

// Prep moves.
enum Dir {
  U,
  R,
  D,
  L,
}
const dirMoves = {
  [Dir.R]: 1,
  [Dir.L]: -1,
  [Dir.D]: map.width,
  [Dir.U]: -map.width,
} as const
function teleport(from: number, angle: Dir): number {
  let [x, y] = map.iToVec(from)
  if (angle === Dir.L || angle === Dir.R) {
    x = edgesX[y * 2 + Number(angle === Dir.R)]!
  } else {
    y = edgesY[x * 2 + Number(angle === Dir.D)]!
  }
  return map.vecToI(x, y)
}
function step(from: number, angle: Dir): number {
  let to = from + dirMoves[angle]
  if (!map[to]) to = teleport(pos, angle)
  const nextFlg = map[to]
  return nextFlg === Cell.Free ? to : from
}

// Move.
let pos = map.findIndex((c) => c === Cell.Free)
let angle: Dir = Dir.R
for (const action of actions) {
  // Handle rotation.
  if (typeof action === 'string') {
    angle = posMod(angle + (action === 'R' ? Dir.R : Dir.L), 4)
  }
  // Handle step.
  else {
    for (let m = 0; m < action; m++) {
      const nextPos = step(pos, angle)
      if (nextPos === pos) break
      pos = nextPos
    }
  }
}

const [endX, endY] = map.iToVec(pos)
const result = endX * 4 + endY * 1000 + posMod(angle - 1, 4)

io.write(result)
