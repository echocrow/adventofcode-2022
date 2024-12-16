import io from '#lib/io.js'
import {filo} from '#lib/iterable.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import {strRec} from '#lib/types.js'

enum Cell {
  Floor,
  Wall,
  Slope,
}
const cellChars = strRec({
  '.': Cell.Floor,
  '#': Cell.Wall,
  '>': Cell.Slope,
  v: Cell.Slope,
})

// Parse maze.
const maze = new Uint8Matrix()
for await (const line of io.readLines())
  maze.pushRow(line.split('').map((c) => cellChars[c] ?? 0))

// Find all possible paths and keep track of the longest.
const startI: number = 1
const endI = maze.length - 2
let max = 0
const queue: [i: number, len: number, seen: Uint8Array][] = [
  [1, 0, new Uint8Array(maze.length).fill(1, startI, startI + 1)],
]
for (let [i, len, seen] of filo(queue)) {
  let newOpts = 0
  if (i === endI) {
    max = Math.max(max, len)
    continue
  }
  len++
  for (const nI of neighbors(maze, i)) {
    const cell = maze.$[nI]
    if (cell === Cell.Wall || seen[nI]) continue
    if (cell === Cell.Slope && nI < i) continue
    if (newOpts++) seen = new Uint8Array(seen)
    seen[nI] = 1
    queue.push([nI, len, seen])
  }
}

io.write(max)
