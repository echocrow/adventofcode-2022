class QueueItem<V, C extends number | bigint = number> {
  constructor(
    public cost: C,
    public item: V,
  ) {}
}

export default class Queue<T> {
  #queue: QueueItem<T>[] = []

  enqueue(cost: number, ...items: T[]) {
    for (const item of items)
      enqueue(this.#queue, Queue.#findNext, new QueueItem(cost, item))
    return this
  }

  dequeue(): QueueItem<T> | undefined {
    return this.#queue.shift()
  }

  *[Symbol.iterator]() {
    while (this.#queue.length) {
      yield this.#queue.shift()!
    }
  }

  static #findNext<T>(q: QueueItem<T>, qi: QueueItem<T>) {
    return q.cost > qi.cost
  }
}

export class MemoQueue<T> extends Queue<T> {
  #memo = new Map<T, number>()
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
  findNext: (queueItem: V, newItem: V) => boolean,
  item: V,
): V[] {
  const q = queue.findIndex((q) => findNext(q, item))
  if (q >= 0) queue.splice(q, 0, item)
  else queue.push(item)
  return queue
}
