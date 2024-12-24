import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {strRec} from '#lib/types.js'
import vec2, {type Vec2} from '#lib/vec2.js'

enum Dir {
  left,
  down,
  right,
  up,
}
function idDir(dir: Dir): Dir {
  return 1 << dir
}
const DIR_VEC: Record<Dir, Vec2> = [
  /* left: */ vec2(-1, 0),
  /* down: */ vec2(0, 1),
  /* right: */ vec2(1, 0),
  /* up: */ vec2(0, -1),
]
function dirIsHor(dir: Dir): boolean {
  return dir === Dir.left || dir === Dir.right
}
const dirByChar = strRec({
  L: Dir.left,
  D: Dir.down,
  R: Dir.right,
  U: Dir.up,
})

// Parse plan.
let pos = vec2()
const moves: (readonly [Dir, len: number])[] = []
const corners: Vec2[] = []
for await (const match of io.readRegExp(/^(\w) (\d+)/m)) {
  const dir = dirByChar[match[1]!]!
  const len = Number(match[2])
  moves.push([dir, len])
  pos = pos.add(DIR_VEC[dir].scale(len))
  corners.push(pos)
}
// Determine bounds and top horizontal move.
const minCorner = vec2.via(corners.reduce(vec2.min, vec2()))
const maxCorner = vec2.via(corners.reduce(vec2.max, vec2()))
const topXMoveIdx = moves.findIndex(
  ([dir], i) => dirIsHor(dir) && corners[i]![1] === minCorner[1],
)
const startPos = corners.at(topXMoveIdx - 1)!.add(minCorner.invert())
// Splice top edge move to the top. (Possible because the moves form a loop.)
moves.push(...moves.splice(0, topXMoveIdx))

// Draw construction site.
const siteWidth = maxCorner[0] - minCorner[0] + 1
const siteHeight = maxCorner[1] - minCorner[1] + 1
const site = new Uint8Matrix(siteWidth * siteHeight, siteWidth)
{
  let posI = site.vecToI(startPos)
  let angle = Dir.up
  let prevDir = moves[0]![0]
  for (const [dir, len] of moves) {
    angle = posMod(angle + dir - prevDir, 4)
    const vec = DIR_VEC[dir]
    site.$[posI]! |= idDir(angle)
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
