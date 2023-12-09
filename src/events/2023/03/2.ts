import io from '#lib/io.js'
import sum from '#lib/sum.js'

const symbolsRe = /[^\d.]/g
const numsRe = /\d+/g
export function parseRow(str: string) {
  return {
    symbolsAt: [...str.matchAll(symbolsRe)].map((match) => match.index ?? 0),
    nums: [...str.matchAll(numsRe)].map((match) => ({
      start: (match.index ?? 0) - 1,
      end: (match.index ?? 0) + match[0].length,
      val: Number(match[0]),
    })),
  }
}

let result = 0
const rows = [parseRow(''), parseRow(''), parseRow('')]
let nextRow = ''
do {
  nextRow = (await io.readLine()) ?? ''
  rows[0] = rows[1]!
  rows[1] = rows[2]!
  rows[2] = parseRow(nextRow)
  const nums = rows.flatMap((row) => row.nums)
  const gearRatios = rows[1].symbolsAt
    .map((pos) => nums.filter((n) => n.start <= pos && pos <= n.end))
    .filter((nums) => nums.length === 2)
    .map((nums) => nums[0]!.val * nums[1]!.val)
  result += sum(gearRatios)
} while (nextRow)

io.write(result)
