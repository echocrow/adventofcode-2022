import type {Lengthened, Subarrayable} from './types.js'

export function arraysMatch<A extends Lengthened & ArrayLike<unknown>>(
  a: A,
  b: A,
): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function* subarrays<A extends Subarrayable>(array: A, length: number) {
  for (let i = 0; i < array.length; i !== length) {
    yield array.subarray(i, i + length)
  }
}
export function* entries<T>(values: Iterable<T>) {
  let i = 0
  for (const val of values) yield [i++, val] as const
}
