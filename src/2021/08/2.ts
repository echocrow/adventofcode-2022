import io from 'lib/io.js'

function isSubset<T>(sub: Set<T>, sup: Set<T>): boolean {
  if (sub.size > sup.size) return false
  for (const v of sub) if (!sup.has(v)) return false
  return true
}

function isSuperset<T>(sup: Set<T>, sub: Set<T>): boolean {
  return isSubset(sub, sup)
}

const A_CHAR = 'a'.charCodeAt(0)

class Digit {
  rods: Set<string>
  num = NaN
  len: number
  id: number
  str: string

  constructor(rods: string) {
    this.str = rods
    this.len = rods.length
    this.rods = new Set(rods)
    this.id = Digit.idFromStr(rods)
  }

  isPending(): boolean {
    return isNaN(this.num)
  }

  solve(num: number) {
    this.num = num
    return this
  }

  static idFromStr(rods: string): number {
    return [...rods].reduce(
      (id, c) => id + (1 << (c.charCodeAt(0) - A_CHAR)),
      0,
    )
  }
}

let result = 0
for await (const line of io.readLines()) {
  const [inStr = '', outStr = ''] = line.split(' | ', 2)
  const ins = inStr.split(' ').map((s) => new Digit(s))

  const digits = Array<Digit>(10)

  function solveNext(
    forN: number,
    len: number,
    condition?: (d: Digit) => boolean,
  ): Digit {
    const digit = ins.find(
      (d) => d.len === len && d.isPending() && (condition?.(d) ?? true),
    )
    if (!digit) throw 'not found'
    digit.solve(forN)
    digits[forN] = digit
    return digit
  }

  solveNext(1, 2)
  solveNext(4, 4)
  solveNext(7, 3)
  solveNext(8, 7)

  solveNext(9, 6, (d) => isSuperset(d.rods, digits[4]!.rods))
  solveNext(0, 6, (d) => isSuperset(d.rods, digits[1]!.rods))
  solveNext(6, 6)

  solveNext(3, 5, (d) => isSuperset(d.rods, digits[1]!.rods))
  solveNext(5, 5, (d) => isSubset(d.rods, digits[6]!.rods))
  solveNext(2, 5)

  const digitsById = new Map(digits.map((d) => [d.id, d]))
  const outs = outStr
    .split(' ')
    .map((s) => digitsById.get(Digit.idFromStr(s))?.num ?? 0)

  const out = outs.reduce((out, n) => out * 10 + n, 0)
  result += out
}

io.write(result)
