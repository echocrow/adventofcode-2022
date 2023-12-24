import io from '#lib/io.js'
import {filo, filter, first} from '#lib/iterable.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import {MemoMap} from '#lib/memo.js'

function bitFlag(width: number) {
  return 1n << BigInt(width - 1)
}

class Node {
  private static _id = 0
  public readonly id = bitFlag(Node._id++)
  readonly paths = new Map<Node, number>()
  constructor(public readonly i: number) {}
  connect(node: Node, len: number) {
    this.paths.set(node, len)
    node.paths.set(this, len)
  }
}

// Parse maze.
const maze = new Uint8Matrix()
for await (const line of io.readLines())
  maze.pushRow(line.split('').map((c) => +(c === '#')))

// Gather nodes.
const nodesMap = new MemoMap((i: number) => new Node(i))
const start = nodesMap.get(1)
const end = nodesMap.get(maze.length - 2)
{
  const seen = new Uint8Array(maze.length)
  seen[start.i] = seen[end.i] = 1
  const canStep = (i: number) => !maze.$[i] && !seen[i]

  const queue: Node[] = [start]
  for (const from of filo(queue)) {
    let i = first(filter(neighbors(maze, from.i), canStep))
    if (!i) continue
    queue.push(from)

    let len = 0
    let next: number[] = [i]
    while (next.length === 1) {
      i = next.pop()!
      seen[i] = 1
      len++
      for (const nI of neighbors(maze, i)) {
        if (nodesMap.has(nI) && nI !== from.i)
          nodesMap.get(nI)!.connect(from, len + 1)
        if (!canStep(nI)) continue
        next.push(nI)
      }
    }
    if (!next.length) continue
    const fork = nodesMap.get(i)
    from.connect(fork, len)
    queue.push(fork)
  }

  // Set start/end nodes as one-way connection.
  for (const node of nodesMap.values()) node.paths.delete(start)
  end.paths.clear()
}

// Brute-force-find longest path.
let max = 0
{
  const queue = [[start, 0 as number, start.id] as const]
  for (const [node, len, prev] of filo(queue)) {
    for (const [to, toLen] of node.paths)
      if (!(prev & to.id)) queue.push([to, len + toLen, prev | node.id])
    if (node === end) max = Math.max(max, len)
  }
}

io.write(max)
