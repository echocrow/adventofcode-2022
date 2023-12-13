type DisposeFn = Disposable[typeof Symbol.dispose]

export default function memoize<TArgs extends [any], TRes>(
  fn: (...args: TArgs) => TRes,
): ((...args: TArgs) => TRes) & Disposable {
  return memoizeWithKey(fn, (...args) => args[0])
}

export function memoizeWithKey<TArgs extends any[], TRes, TKey>(
  fn: (...args: TArgs) => TRes,
  getKey: (...args: TArgs) => TKey,
): ((...args: TArgs) => TRes) & Disposable {
  const memo = new Map<TKey, TRes>()
  return memoizeWithStorage(fn, getKey, memo)
}

export function memoizeWithStorage<TArgs extends any[], TRes, TKey>(
  fn: (...args: TArgs) => TRes,
  getKey: (...args: TArgs) => TKey,
  memo: {
    has: (key: TKey) => boolean
    get: (key: TKey) => TRes | undefined
    set: (key: TKey, val: TRes) => void
    clear?: () => void
  },
): ((...args: TArgs) => TRes) & Disposable {
  const memFn = (...args: TArgs): TRes => {
    const key = getKey(...args)
    if (memo.has(key)) return memo.get(key)!
    const res = fn(...args)
    memo.set(key, res)
    return res
  }
  memFn[Symbol.dispose] = (() => memo.clear?.()) as DisposeFn
  return memFn
}
