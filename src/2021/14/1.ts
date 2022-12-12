import Counter from 'lib/counter.js'
import IO from 'lib/io.js'
import range from 'lib/range.js'
import sort from 'lib/sort.js'

const io = new IO()

const startingPoly = await io.readLine()
const firstLetter = startingPoly[0] ?? ''

let pairs = [...range(0, startingPoly.length - 1)].reduce((pairs, i) => {
  const pair = startingPoly.slice(i, i + 2)
  return pairs.inc(pair, 1)
}, new Counter())

const insertions: Record<string, string> = {}
for await (const line of io.readLines()) {
  if (line) {
    const [from = '', to = ''] = line.split(' -> ')
    insertions[from] = to
  }
}

for (let i = 0; i < 10; i++) {
  const newPairs = new Counter()
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
  new Counter().inc(firstLetter, 1),
)
const countNums = [...counts.values()]

const leastCommon = Math.min(...countNums)
const mostCommon = Math.max(...countNums)

io.write(mostCommon - leastCommon)
