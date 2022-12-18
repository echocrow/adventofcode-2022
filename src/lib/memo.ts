export default function memoize<F extends (arg: any) => any>(fn: F): F {
  type Arg = Parameters<F>[0]
  const memo = new Map<Arg, ReturnType<F>>()
  return ((arg: Arg) => {
    if (!memo.has(arg)) memo.set(arg, fn(arg))
    return memo.get(arg) as ReturnType<F>
  }) as F
}
