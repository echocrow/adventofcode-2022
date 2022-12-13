export default class Counter<K = string> extends Map<K, number> {
  inc(key: K, delta = 1) {
    return this.set(key, (this.get(key) ?? 0) + delta)
  }

  static fromValues<K>(items: Iterable<K>) {
    const counter = new Counter<K>()
    for (const key of items) counter.inc(key)
    return counter
  }

  static fromEntries<K>(items: Iterable<readonly [K, number]>) {
    const counter = new Counter<K>()
    for (const [key, num] of items) counter.inc(key, num)
    return counter
  }
}

export class BigCounter<K = string> extends Map<K, bigint> {
  inc(key: K, delta = 1n) {
    return this.set(key, (this.get(key) ?? 0n) + delta)
  }

  static fromValues<K>(items: Iterable<K>) {
    const counter = new BigCounter<K>()
    for (const key of items) counter.inc(key)
    return counter
  }

  static fromEntries<K>(items: Iterable<readonly [K, bigint]>) {
    const counter = new BigCounter<K>()
    for (const [key, num] of items) counter.inc(key, num)
    return counter
  }
}
