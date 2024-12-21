import io from '#lib/io.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import vec, {type Vec2} from '#lib/vec.js'

const DIR = {
  UP: vec(0, -1),
  DOWN: vec(0, 1),
  LEFT: vec(-1, 0),
  RIGHT: vec(1, 0),
}

const pieces = [
  {char: '.', links: [] as Vec2[]},
  {char: 'F', links: [DIR.DOWN, DIR.RIGHT]},
  {char: '|', links: [DIR.UP, DIR.DOWN]},
  {char: 'L', links: [DIR.UP, DIR.RIGHT]},
  {char: '-', links: [DIR.LEFT, DIR.RIGHT]},
  {char: '7', links: [DIR.DOWN, DIR.LEFT]},
  {char: 'J', links: [DIR.UP, DIR.LEFT]},
] as const satisfies {char: string; links: Vec2[]}[]
type PieceChar = (typeof pieces)[number]['char']
const pieceIds = Object.fromEntries(
  pieces.map((piece, i) => [piece.char, i]),
) as Record<PieceChar, number>

// Parse maze.
let startPos = vec()
let maze = new Uint8Matrix()
for await (const line of io.readLines()) {
  const pieces = ([...line] as PieceChar[]).map(
    (char, i) => pieceIds[char] ?? ((startPos = vec(i, maze.height)), 0),
  )
  maze.pushRow(pieces)
}
const startI = maze.vecToI(startPos)

// Get neighbor connected to start.
const startNeighborI = [...neighbors(maze, startI)].find((i) => {
  const piece = pieces[maze.$[i]!]!
  const pos = maze.iToVec(i)
  const posDiff = startPos.subtract(pos)
  return piece.links.some((link) => link.equals(posDiff))
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
    .map((link) => maze.vecToI(pos.add(link)))
    .find((i) => !mazeSteps[i])
}

io.write(mazeLen / 2)
