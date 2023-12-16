import io from '#lib/io.js'
import {Matrix, Uint8Matrix} from '#lib/matrix.js'
import type {vec2} from '#lib/vec2.js'

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
const DIR_VEC: Record<Dir, vec2> = [
  /* left: */ [-1, 0],
  /* down: */ [0, 1],
  /* right: */ [1, 0],
  /* up: */ [0, -1],
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

// Parse map.
const map = new Matrix<Piece[]>([])
for await (const line of io.readLines())
  map.pushRow(line.split('').map((c) => pieces[c]!))

// Shoot beam.
const seenBeams = new Uint8Matrix(map.length, map.width)
const queue = [[0, Dir.right] as [number, Dir]]
let beam: (typeof queue)[number] | undefined
while ((beam = queue.pop())) {
  const [i, dir] = beam
  const piece = map.$[i]!
  const nextBeams = piece[dir]
  seenBeams.$[i] |= idDir(dir)
  for (const newDir of nextBeams) {
    seenBeams.$[i] |= idDir(revertDir(newDir))
    const newI = map.moveBy(i, DIR_VEC[newDir])
    if (newI === undefined) continue
    if (seenBeams.$[newI]! & idDir(newDir)) continue
    queue.push([newI, newDir])
  }
}

// Count visited fields.
let result = 0
for (const v of seenBeams.$) result += +!!v

io.write(result)
