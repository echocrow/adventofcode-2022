import io from '#lib/io.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import {
  type vec2,
  addVec2,
  equalsVec,
  subtractVec2,
  zeroVec2,
} from '#lib/vec2.js'

const DIR = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
} satisfies Record<string, vec2>

const pieces = [
  {char: '.', links: [] as vec2[]},
  {char: 'F', links: [DIR.DOWN, DIR.RIGHT]},
  {char: '|', links: [DIR.UP, DIR.DOWN]},
  {char: 'L', links: [DIR.UP, DIR.RIGHT]},
  {char: '-', links: [DIR.LEFT, DIR.RIGHT]},
  {char: '7', links: [DIR.DOWN, DIR.LEFT]},
  {char: 'J', links: [DIR.UP, DIR.LEFT]},
] as const satisfies {char: string; links: vec2[]}[]
type PieceChar = (typeof pieces)[number]['char']
const pieceIds = Object.fromEntries(
  pieces.map((piece, i) => [piece.char, i]),
) as Record<PieceChar, number>

// Parse maze.
let startPos = zeroVec2
let maze = new Uint8Matrix()
for await (const line of io.readLines()) {
  const pieces = (line.split('') as PieceChar[]).map(
    (char, i) => pieceIds[char] ?? ((startPos = [i, maze.height]), 0),
  )
  maze.pushRow(pieces)
}
const startI = maze.vecToI(...startPos)

// Get neighbor connected to start.
const startNeighborI = [...neighbors(maze, startI)].find((i) => {
  const piece = pieces[maze.$[i]!]!
  const pos = maze.iToVec(i)
  const posDiff = subtractVec2(startPos, pos)
  return piece.links.some((link) => equalsVec(link, posDiff))
})

// Trace maze.
let posI = startNeighborI
let mazeLen = 0
const mazeSteps = new Uint32Array(maze.length)
mazeSteps[startI] = ++mazeLen
while (posI !== undefined) {
  mazeSteps[posI] = ++mazeLen
  const pos = maze.iToVec(posI)
  const piece = pieces[maze.$[posI]!]!
  posI = piece.links
    .map((link) => maze.vecToI(...addVec2(pos, link)))
    .find((i) => !mazeSteps[i])
}

io.write(mazeLen / 2)
