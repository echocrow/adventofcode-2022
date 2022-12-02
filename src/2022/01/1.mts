import readLines from '../../lib/readLines.mjs'

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

console.log(Math.max(...batches))
