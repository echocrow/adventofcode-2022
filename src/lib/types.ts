export type ArrayItem<T> =
  T extends Array<infer V> ? V
  : T extends RelativeIndexable<infer V> ? V
  : never

export interface Lengthened {
  readonly length: number
}

export interface Reducible<R, T> extends Lengthened {
  reduce(
    callbackfn: (previousValue: R, currentValue: T, currentIndex: number) => R,
  ): R
  reduce(
    callbackfn: (previousValue: R, currentValue: T, currentIndex: number) => R,
    initialValue: R,
  ): R
}

export interface Sliceable<A> extends Lengthened {
  slice(start?: number, end?: number): A
}

export interface Subarrayable extends Lengthened {
  subarray(start?: number, end?: number): this
}

/**
 * Type an object as `Record<string, TValues>`.
 *
 * This function is a noop, and only alters the declared type.
 * Explicit keys are retained, and `[string]` lookups are supported.
 */
export function strRec<T extends Record<string | number, any>>(
  obj: T,
): T & {[key: string]: T[keyof T]} {
  return obj
}
