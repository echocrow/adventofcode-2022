import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import range from '#lib/range.js'

// Parse.
const tmpNums: number[] = []
for await (const line of io.readLines()) {
  tmpNums.push(Number(line))
}
const len = tmpNums.length
const cycl = len - 1

const nums = new Int16Array(tmpNums)
const idxs = new Int16Array(range(0, len))

// Mix.
function mix() {
  for (let n = 0; n < nums.length; n++) {
    const num = nums[n]!
    const from = idxs.indexOf(n)
    const to = Number(posMod(from + num, cycl))
    if (from < to) {
      idxs.set(idxs.subarray(from + 1, to + 1), from)
    } else {
      idxs.set(idxs.subarray(to, from), to + 1)
    }
    idxs[to] = n
  }
}
mix()

// Sum.
function getNth(fromI: number, delta: number): number {
  const toI = posMod(fromI + delta, len)
  const n = idxs[toI]!
  return nums[n]!
}
const zeroN = nums.indexOf(0)
const zeroI = idxs.indexOf(zeroN)
const result = getNth(zeroI, 1000) + getNth(zeroI, 2000) + getNth(zeroI, 3000)

io.write(result)
