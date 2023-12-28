import io from '#lib/io.js'
import {fifo, first} from '#lib/iterable.js'
import {MemoMap} from '#lib/memo.js'

class Node {
  static db = new MemoMap<string, Node>((name) => new Node(name))

  public readonly id = Node.db.size + 1
  public readonly edges = new Map<number, Edge>()
  constructor(public readonly name: string) {
    this.name = name
  }

  #idMask: bigint | undefined = undefined
  get idMask() {
    return (this.#idMask ??= 1n << BigInt(this.id))
  }

  add(edge: Edge) {
    this.edges.set(edge.id, edge)
  }
  remove(edge: Edge) {
    this.edges.delete(edge.id)
  }
}

class Edge {
  public static db: Edge[] = []

  public readonly id
  constructor(
    public readonly from: Node,
    public readonly to: Node,
    id?: number,
  ) {
    this.id = id ?? Edge.db.push(this) - 1
  }

  get flipped() {
    return new Edge(this.to, this.from, this.id)
  }

  connect() {
    this.from.add(this)
    this.to.add(this.flipped)
  }
  disconnect() {
    this.from.remove(this)
    this.to.remove(this)
  }
}

function traverseGraph(node: Node, onVisit: (edge: Edge) => void) {
  let visited = 0n
  let queue = [node]
  visited |= node.idMask
  for (const node of fifo(queue)) {
    for (const edge of node.edges.values()) {
      if (visited & edge.to.idMask) continue
      visited |= edge.to.idMask
      queue.push(edge.to)
      onVisit(edge)
    }
  }
}

// Create graph.
for await (const line of io.readLines()) {
  const [l = '', rs = ''] = line.split(': ')
  const lNode = Node.db.get(l)
  for (const r of rs.split(' ')) new Edge(lNode, Node.db.get(r)).connect()
}

// Disconnect the most traversed edge until the graph splits.
const graphSize = Node.db.size
let subGraphSize = Node.db.size
while (subGraphSize === graphSize) {
  // Find the most traversed edge.
  const edgeCounts = new Uint16Array(Edge.db.length)
  let topEdgeId = -1
  let topEdgeCount = 0
  let scanned = 0
  const scanThreshold = 100 // Semi-arbitrary cap; no need to scan more.
  for (const node of Node.db.values()) {
    traverseGraph(node, (edge) => {
      const edgeCount = edgeCounts[edge.id]++
      if (edgeCount > topEdgeCount) {
        topEdgeId = edge.id
        topEdgeCount = edgeCount
      }
    })
    if (++scanned >= scanThreshold) break
  }
  Edge.db[topEdgeId]!.disconnect()

  // Update size of subgraph.
  subGraphSize = 1
  traverseGraph(first(Node.db.values())!, () => subGraphSize++)
}

io.write(subGraphSize * (graphSize - subGraphSize))
