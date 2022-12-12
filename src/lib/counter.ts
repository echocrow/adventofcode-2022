export default class Counter<K = string> extends Map<K, number> {
  inc(key: K, delta = 1) {
    return this.set(key, (this.get(key) ?? 0) + delta)
  }
}

export class BigCounter<K = string> extends Map<K, bigint> {
  inc(key: K, delta = 1n) {
    return this.set(key, (this.get(key) ?? 0n) + delta)
  }
}
