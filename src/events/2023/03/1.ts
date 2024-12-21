import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

const symbolsRe = /[^\d.]/g
const numsRe = /\d+/g
function parseRow(str: string) {
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
  const symbolsAt = rows.flatMap((row) => row.symbolsAt)
  const okNums = rows[1].nums
    .filter((n) => symbolsAt.some((pos) => n.start <= pos && pos <= n.end))
    .map((n) => n.val)
  result += sum(okNums)
} while (nextRow)

io.write(result)
