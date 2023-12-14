import io from '#lib/io.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import {type vec2, addVec2, equalsVec, zeroVec2, scaleVec2} from '#lib/vec2.js'

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
  {char: 'O', links: [] as vec2[]},
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

// Solve for start.
{
  function checkNeighborConnects(pos: vec2, dir: vec2): boolean {
    const nPos = addVec2(pos, dir)
    const nI = maze.cell(...nPos) ?? 0
    const oppDir = scaleVec2(dir, -1)
    return !!pieces[nI]?.links.some((link) => equalsVec(link, oppDir))
  }
  const linksLeft = checkNeighborConnects(startPos, DIR.LEFT)
  const linksUp = checkNeighborConnects(startPos, DIR.UP)
  const linksRight = checkNeighborConnects(startPos, DIR.RIGHT)
  const startChar: (typeof pieces)[number]['char'] =
    linksLeft ?
      linksUp ? 'J'
      : linksRight ? '-'
      : '7'
    : linksUp ?
      linksRight ? 'L'
      : '|'
    : 'F'
  maze.$[startI] = pieceIds[startChar]
}

// Clean up non-maze pieces.
{
  let noisyMaze = new Uint8Array(maze.$)
  maze.$.fill(0)
  let posI = startI as number | undefined
  while (posI !== undefined) {
    maze.$[posI] = noisyMaze[posI]!
    const pos = maze.iToVec(posI)
    const piece = pieces[maze.$[posI]!]!
    posI = piece.links
      .map((link) => maze.vecToI(...addVec2(pos, link)))
      .find((i) => !maze.$[i])
  }
}

// Scale maze.
const dblMaze = new Uint8Matrix(maze.length * 4, maze.width * 2)
{
  for (let i = 0; i < maze.length; i++) {
    const id = maze.$[i]!
    const piece = pieces[id]!
    const [x, y] = maze.iToVec(i)
    const scaledX = x * 2
    const scaledY = y * 2
    dblMaze.setCell(scaledX, scaledY, id)
    if (piece.links.includes(DIR.RIGHT))
      dblMaze.setCell(scaledX + 1, scaledY, pieceIds['-'])
    if (piece.links.includes(DIR.DOWN))
      dblMaze.setCell(scaledX, scaledY + 1, pieceIds['|'])
  }
}

// Fill outside of scaled maze.
{
  const outsideId = pieceIds['O']
  // Start from the four corners.
  const queue = [
    0,
    dblMaze.vecToI(dblMaze.width - 1, 0),
    dblMaze.vecToI(0, dblMaze.height - 1),
    dblMaze.vecToI(dblMaze.width - 1, dblMaze.height - 1),
  ].filter((i) => !dblMaze.$[i])
  let posI: number | undefined
  while ((posI = queue.pop()) !== undefined) {
    dblMaze.$[posI] = outsideId
    for (const nI of neighbors(dblMaze, posI))
      if (!dblMaze.$[nI]) queue.push(nI)
  }
}

// Count empty original cells.
let insideCount = 0
for (let x = 0; x < dblMaze.width; x += 2)
  for (let y = 0; y < dblMaze.height; y += 2)
    if (!dblMaze.cell(x, y)) insideCount++
io.write(insideCount)

/**
 * Explanation:
 *
 * After parsing the maze, we're removing all pipe pieces that aren't part of
 * the main loop.
 *
 * Following that, to solve for the "squeezing" feature, we double the maze,
 * "stretching" each cell down and to the right by one.
 *
 * Doing so, the following example maze...
 *
 * ..........
 * .F------7.
 * .|F----7|.
 * .||....||.
 * .||....||.
 * .|L-7F-J|.
 * .|..||..|.
 * .L--JL--J.
 * ..........
 *
 * ...expands into...
 *
 * ....................
 * ....................
 * ..F-------------7...
 * ..|.............|...
 * ..|.F---------7.|...
 * ..|.|.........|.|...
 * ..|.|.........|.|...
 * ..|.|.........|.|...
 * ..|.|.........|.|...
 * ..|.|.........|.|...
 * ..|.L---7.F---J.|...
 * ..|.....|.|.....|...
 * ..|.....|.|.....|...
 * ..|.....|.|.....|...
 * ..L-----J.L-----J...
 * ....................
 * ....................
 * ....................
 *
 * From there, we simple fill neighboring outside tiles, starting from the four
 * corners (hoping that there aren't any sneaky gaps touching the edges.)...
 *
 * OOOOOOOOOOOOOOOOOOOO
 * OOOOOOOOOOOOOOOOOOOO
 * OOF-------------7.OO
 * OO|.............|.OO
 * OO|.F---------7.|.OO
 * OO|.|OOOOOOOOO|.|.OO
 * OO|.|OOOOOOOOO|.|.OO
 * OO|.|OOOOOOOOO|.|.OO
 * OO|.|OOOOOOOOO|.|.OO
 * OO|.|OOOOOOOOO|.|.OO
 * OO|.L---7OF---J.|.OO
 * OO|.....|O|.....|.OO
 * OO|.....|O|.....|.OO
 * OO|.....|O|.....|.OO
 * OOL-----JOL-----J.OO
 * OOOOOOOOOOOOOOOOOOOO
 * OOOOOOOOOOOOOOOOOOOO
 * OOOOOOOOOOOOOOOOOOOO
 *
 * Lastly, we need to count the remaining _original_ empty cells. We can achieve
 * this by discarding empty cells in odd rows or odd columns; those originated
 * during scaling. In other words, we only count empty cells located in both
 * even rows & columns.
 *
 * Done!
 */
