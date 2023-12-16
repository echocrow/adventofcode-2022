import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'

const cave = new Uint8Matrix()
for await (const line of io.readLines()) {
  cave.pushRow([...line].map(Number))
}

const lows = cave.$.filter((h, i) =>
  [...neighbors(cave, i)].every((n) => h < cave.$[n]!),
)

const result = sum(lows) + lows.length
io.write(result)
