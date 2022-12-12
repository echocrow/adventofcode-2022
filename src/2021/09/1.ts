import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import sum from 'lib/sum.js'

const io = new IO()

let cave = new Uint8Matrix()
for await (const line of io.readLines()) {
  cave = cave.concatRow([...line].map(Number))
}

const lows = cave.filter((h, i) =>
  [...neighbors(cave, i)].every((n) => h < cave[n]!),
)

const result = sum(lows) + lows.length
io.write(result)
