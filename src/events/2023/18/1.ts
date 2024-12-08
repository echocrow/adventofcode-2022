import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {
  addVec2,
  maxVec2,
  minVec2,
  scaleVec2,
  zeroVec2,
  type vec2,
  invertVec2,
} from '#lib/vec2.v1.js'

enum Dir {
  left,
  down,
  right,
  up,
}
function idDir(dir: Dir): Dir {
  return 1 << dir
}
const DIR_VEC: Record<Dir, vec2> = [
  /* left: */ [-1, 0],
  /* down: */ [0, 1],
  /* right: */ [1, 0],
  /* up: */ [0, -1],
]
function dirIsHor(dir: Dir): boolean {
  return dir === Dir.left || dir === Dir.right
}
const dirByChar: Record<string, Dir> = {
  L: Dir.left,
  D: Dir.down,
  R: Dir.right,
  U: Dir.up,
}

// Parse plan.
let pos = zeroVec2
const moves: (readonly [Dir, len: number])[] = []
const corners: vec2[] = []
for await (const match of io.readRegExp(/^(\w) (\d+)/m)) {
  const dir = dirByChar[match[1]!]!
  const len = Number(match[2])
  moves.push([dir, len])
  pos = addVec2(pos, scaleVec2(DIR_VEC[dir], len))
  corners.push(pos)
}
// Determine bounds and top horizontal move.
const minCorner = corners.reduce(minVec2)
const maxCorner = corners.reduce(maxVec2)
const topXMoveIdx = moves.findIndex(
  ([dir], i) => dirIsHor(dir) && corners[i]![1] === minCorner[1],
)
const startPos = addVec2(corners.at(topXMoveIdx - 1)!, invertVec2(minCorner))
// Splice top edge move to the top. (Possible because the moves form a loop.)
moves.push(...moves.splice(0, topXMoveIdx))

// Draw construction site.
const siteWidth = maxCorner[0] - minCorner[0] + 1
const siteHeight = maxCorner[1] - minCorner[1] + 1
const site = new Uint8Matrix(siteWidth * siteHeight, siteWidth)
{
  let posI = site.vecToI(...startPos)
  let angle = Dir.up
  let prevDir = moves[0]![0]
  for (const [dir, len] of moves) {
    angle = posMod(angle + dir - prevDir, 4)
    const vec = DIR_VEC[dir]
    site.$[posI] |= idDir(angle)
    for (let s = 0; s < len; s++) {
      posI = site.moveBy(posI, vec)!
      site.$[posI] = idDir(angle)
    }
    prevDir = dir
  }
}

// Count inside vs outside.
let result = 0
const leftDirId = idDir(Dir.left)
{
  for (let y = 0; y < site.height; y++) {
    let prevTrenchId = 0
    let isIn = false
    for (const v of site.row(y)) {
      if (v) (isIn = true), (prevTrenchId = v)
      else if (prevTrenchId) isIn = !!(prevTrenchId & leftDirId)
      if (isIn) result++
    }
  }
}

io.write(result)
