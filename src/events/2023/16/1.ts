import io from '#lib/io.js'
import {map, sum} from '#lib/iterable.js'
import {Matrix, Uint8Matrix} from '#lib/matrix.js'
import {FILOQueue} from '#lib/queue.js'
import vec, {type Vec2} from '#lib/vec.js'

enum Dir {
  left,
  down,
  right,
  up,
}
function revertDir(dir: Dir): Dir {
  return (dir + 2) % 4
}
function idDir(dir: Dir): Dir {
  return 1 << dir
}
const DIR_VEC: Record<Dir, Vec2> = [
  /* left: */ vec(-1, 0),
  /* down: */ vec(0, 1),
  /* right: */ vec(1, 0),
  /* up: */ vec(0, -1),
]

// Reflectors & mirrors, and definitions how beams react per direction.
const pieces: Record<string, Record<Dir, Dir[]>> = {
  '.': [[Dir.left], [Dir.down], [Dir.right], [Dir.up]],
  '-': [[Dir.left], [Dir.left, Dir.right], [Dir.right], [Dir.left, Dir.right]],
  '|': [[Dir.down, Dir.up], [Dir.down], [Dir.down, Dir.up], [Dir.up]],
  '/': [[Dir.down], [Dir.left], [Dir.up], [Dir.right]],
  '\\': [[Dir.up], [Dir.right], [Dir.down], [Dir.left]],
}
type Piece = (typeof pieces)[string]

// Parse grid.
const grid = new Matrix([] as Piece[])
for await (const line of io.readLines())
  grid.pushRow(line.split('').map((c) => pieces[c]!))

// Shoot beam.
const queue = new FILOQueue([0, Dir.right] as readonly [number, Dir])
const visited = new Uint8Matrix(grid.length, grid.width)
for (const beam of queue) {
  const [i, dir] = beam
  const piece = grid.$[i]!
  const nextBeams = piece[dir]
  visited.$[i]! |= idDir(dir)
  for (const newDir of nextBeams) {
    visited.$[i]! |= idDir(revertDir(newDir))
    const newI = grid.moveBy(i, DIR_VEC[newDir])
    if (newI === undefined) continue
    if (visited.$[newI]! & idDir(newDir)) continue
    queue.push([newI, newDir])
  }
}

// Count visited fields.
io.write(sum(map(visited, (v) => +!!v)))
