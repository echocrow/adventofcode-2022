import readLines from '../../lib/readLines.js'
import sum from '../../lib/sum.js'

const batches = []
let acc = 0

for await (const line of readLines(__dirname)) {
  if (line) {
    acc += parseInt(line, 10)
  } else if (acc) {
    batches.push(acc)
    acc = 0
  }
}

const topBatches = batches.sort().slice(-3)

console.log(sum(topBatches))
