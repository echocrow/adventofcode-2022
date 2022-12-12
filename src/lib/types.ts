export interface Lengthened {
  length: number
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
