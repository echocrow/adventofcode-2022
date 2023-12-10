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

export async function arrFromAsync<T>(
  iterator: AsyncIterable<T>,
): Promise<T[]> {
  const vals: T[] = []
  for await (const val of iterator) vals.push(val)
  return vals
}

export type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
export type TypedArray = InstanceType<TypedArrayConstructor>

/**
 * Ensure array `arr` is at least `minLen` long.
 *
 * When `arr` is insufficiently long, a new, larger array will be returned. The
 * new array will contain a copy of the original values, and its new length may
 * exceed `minLen`.
 */
export function allocArrLen<T extends TypedArray & {constructor: Function}>(
  arr: T,
  minLen: number,
): T {
  if (arr.length >= minLen) return arr
  const Constructor = arr.constructor as new (len: number) => T
  const newArr = new Constructor(Math.max(arr.length * 2, minLen))
  newArr.set(arr)
  return newArr
}

export function mapFind<T, U>(
  items: Iterable<T>,
  map: (val: T) => U | undefined,
): U | undefined {
  for (const val of items) {
    const mapped = map(val)
    if (mapped !== undefined) return mapped
  }
  return undefined
}

export function sortNumeric(arr: number[]): number[] {
  return arr.sort((a, b) => a - b)
}
