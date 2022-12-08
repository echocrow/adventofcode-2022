import IO from 'lib/io.js'
import rotate from 'lib/rotate.js'

const io = new IO()

class Tree {
  constructor(public id: number, public height: number) {}
}

let size = 0
let r = 0
const trees: Tree[] = []
for await (const line of io.readLines()) {
  const row = [...line].map((h, i) => new Tree(i + size * r, Number(h)))
  trees.push(...row)
  size = row.length
  r++
}

const seenCounts = new Uint32Array(size ** 2).fill(1)
let forest = trees
for (let t = 0; t < 4; t++) {
  if (t) forest = rotate(forest, size)
  for (const [i, tree] of forest.entries()) {
    const y = i % size
    const rightTrees = forest.slice(i + 1, i + size - y)
    const blockingIdx = rightTrees.findIndex((t) => t.height >= tree.height)
    const visibleCount = blockingIdx >= 0 ? blockingIdx + 1 : rightTrees.length
    seenCounts[tree.id] *= visibleCount
  }
}

io.write(Math.max(...seenCounts))
