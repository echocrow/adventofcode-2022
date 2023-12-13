import io from '#lib/io.js'
import memoize, {memoizeWithStorage} from '#lib/memo.js'
import {repeat} from '#lib/string.js'

using prefixReg = memoize(
  (count: number) => new RegExp(`^[#?]{${count}}(?:[.?]|$)`),
)

let result = 0
for await (const record of io.readRegExp(/([?#.]+) ([\d,]+)/)) {
  const map = repeat(record[1]!, 5, '?')
  const counts = repeat(record[2]!, 5, ',').split(',').map(Number)

  using getMapSlice = memoize((i: number) => map.slice(i))

  const memo = new Float64Array((counts.length + 1) * map.length).fill(-1)
  using resolve = memoizeWithStorage(
    (mapI: number, countI: number): number => {
      const map = getMapSlice(mapI)
      const count = counts[countI]
      if (!map) return +(count === undefined)
      if (count === undefined) return +!map.includes('#')
      if (map[0] === '.') return resolve(mapI + 1, countI)

      let res = 0
      // Check dot.
      if (map[0] === '?') res += resolve(mapI + 1, countI)
      // Check hash & look ahead.
      if (prefixReg(count).test(map))
        res += resolve(mapI + 1 + count, countI + 1)
      return res
    },
    (mapI, countI) => mapI * (counts.length + 1) + countI,
    {
      has: (key) => key < memo.length && memo[key]! >= 0,
      get: (key) => memo[key],
      set: (key, val) => (memo[key] = val),
    },
  )

  result += resolve(0, 0)
}

io.write(result)
