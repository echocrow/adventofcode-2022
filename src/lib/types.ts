export interface Reducible<R, T> {
  length: number
  reduce(
    callbackfn: (previousValue: R, currentValue: T, currentIndex: number) => R,
  ): R
  reduce(
    callbackfn: (previousValue: R, currentValue: T, currentIndex: number) => R,
    initialValue: R,
  ): R
}
