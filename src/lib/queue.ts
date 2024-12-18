import {binSearch} from './array.js'
import {fifo, type ReadGenerator} from './iterable.js'

class PriorityQueueItem<V, C extends number | bigint = number> {
  constructor(
    public cost: C,
    public item: V,
  ) {}
}

export class PriorityQueue<T> {
  #queue: PriorityQueueItem<T>[] = []

  constructor()
  constructor(cost: number, ...items: T[])
  constructor(cost?: number, ...items: T[]) {
    if (cost !== undefined) this.enqueue(cost, ...items)
  }

  enqueue(cost: number, ...items: T[]) {
    for (const item of items)
      enqueue(
        this.#queue,
        PriorityQueue.#sortCompare,
        new PriorityQueueItem(cost, item),
      )
    return this
  }

  dequeue(): PriorityQueueItem<T> | undefined {
    return this.#queue.shift()
  }

  *[Symbol.iterator](): ReadGenerator<PriorityQueueItem<T>> {
    yield* fifo(this.#queue)
  }

  static #sortCompare<T>(a: PriorityQueueItem<T>, b: PriorityQueueItem<T>) {
    return a.cost - b.cost
  }
}

export class MemoQueue<T> extends PriorityQueue<T> {
  #memo = new Map<T, number>()

  constructor()
  constructor(cost: number, ...items: T[])
  constructor(cost?: number, ...items: T[]) {
    super()
    if (cost !== undefined) this.enqueue(cost, ...items)
  }

  enqueue(cost: number, ...items: T[]) {
    items = items.filter((item) => !this.#memo.has(item))
    for (const item of items) this.#memo.set(item, cost)
    return super.enqueue(cost, ...items)
  }
  getCost(item: T): number | undefined {
    return this.#memo.get(item)
  }
  hasCost(item: T): boolean {
    return this.#memo.has(item)
  }
}

export function enqueue<V>(
  queue: V[],
  sortCompare: (a: V, b: V) => number,
  item: V,
): V[] {
  // Check for first item or new max.
  if (!queue.length || sortCompare(queue.at(-1)!, item) <= 0) queue.push(item)
  // Check for new min.
  else if (sortCompare(item, queue[0]!) <= 0) queue.unshift(item)
  // Binary-search insert point.
  else {
    const i = binSearch(1, queue.length - 2, (i) =>
      sortCompare(queue[i]!, item),
    )
    queue.splice(i, 0, item)
  }
  return queue
}
