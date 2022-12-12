import {BigCounter} from 'lib/counter.js'
import IO from 'lib/io.js'
import range from 'lib/range.js'
import sort from 'lib/sort.js'

const io = new IO()

const startingPoly = await io.readLine()
const firstLetter = startingPoly[0] ?? ''

let pairs = [...range(0, startingPoly.length - 1)].reduce((pairs, i) => {
  const pair = startingPoly.slice(i, i + 2)
  return pairs.inc(pair, 1n)
}, new BigCounter())

const insertions: Record<string, string> = {}
for await (const line of io.readLines()) {
  if (line) {
    const [from = '', to = ''] = line.split(' -> ')
    insertions[from] = to
  }
}

for (let i = 0; i < 40; i++) {
  const newPairs = new BigCounter()
  for (const [pair, count] of pairs.entries()) {
    const insert = insertions[pair]
    if (!insert) throw 'missing insertion'
    newPairs.inc(pair[0] + insert, count)
    newPairs.inc(insert + pair[1], count)
  }
  pairs = newPairs
}

const counts = [...pairs.entries()].reduce(
  (counts, [pair, count]) => counts.inc(pair[1] ?? '', count),
  new BigCounter().inc(firstLetter, 1n),
)
const countNums = sort([...counts.values()])

const leastCommon = countNums[0] ?? 0n
const mostCommon = countNums[countNums.length - 1] ?? 0n

io.write((mostCommon - leastCommon).toString())
