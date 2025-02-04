import {sortNums} from '#lib/array.js'
import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

let acc = 0
const batches = []
for await (const line of io.readLines()) {
  if (line) {
    acc += parseInt(line, 10)
  } else {
    batches.push(acc)
    acc = 0
  }
}
batches.push(acc)

const topBatches = sortNums(batches).slice(-3)

io.write(sum(topBatches))
