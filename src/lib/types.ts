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
