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

// Shoot beams.
let max = 0
type Beam = readonly [number, Dir]
const starts: Beam[] = [
  ...Array.from(map.rowI(0), (i) => [i, Dir.down] as const),
  ...Array.from(map.rowI(map.height - 1), (i) => [i, Dir.up] as const),
  ...Array.from(map.colI(0), (i) => [i, Dir.right] as const),
  ...Array.from(map.colI(map.width - 1), (i) => [i, Dir.left] as const),
]
const seenBeams = new Uint8Matrix(map.length, map.width)
for (const start of starts) {
  seenBeams.$.fill(0)

  const queue: Beam[] = [start]
  let beam: Beam | undefined
  while ((beam = queue.pop())) {
    const [i, dir] = beam
    const piece = map.$[i]!
    const newDirs = piece[dir]
    seenBeams.$[i] |= idDir(dir)
    for (const newDir of newDirs) {
      seenBeams.$[i] |= idDir(revertDir(newDir))
      const newI = map.moveBy(i, DIR_VEC[newDir])
      if (newI === undefined) continue
      if (seenBeams.$[newI]! & idDir(newDir)) continue
      queue.push([newI, newDir])
    }
  }

  let res = 0
  for (const v of seenBeams.$) res += +!!v
  max = Math.max(max, res)
}

io.write(max)
