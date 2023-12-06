import io from 'lib/io.js'
import {posMod, posModBig} from 'lib/math.js'
import range from 'lib/range.js'

const DECRYPT_KEY = 811589153n

// Parse.
const bigNums: bigint[] = []
for await (const line of io.readLines()) {
  bigNums.push(BigInt(line) * DECRYPT_KEY)
}
const len = bigNums.length
const cycl = len - 1
const cyclN = BigInt(cycl)

const nums = new Int16Array(
  bigNums.map((bigNum) => Number(posModBig(bigNum, cyclN))),
)
const idxs = new Int16Array(range(0, len))

// Mix.
const MIXES = 10
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
for (let m = 0; m < MIXES; m++) mix()

// Sum.
function getNth(fromI: number, delta: number): bigint {
  const toI = posMod(fromI + delta, len)
  const n = idxs[toI]!
  return bigNums[n]!
}
const zeroN = nums.indexOf(0)
const zeroI = idxs.indexOf(zeroN)
const result = getNth(zeroI, 1000) + getNth(zeroI, 2000) + getNth(zeroI, 3000)

io.write(result.toString())
