import io from '#lib/io.js'
import {range, sum} from '#lib/iterable.js'

function calcNSum(num: number): number {
  return (num * (num + 1)) / 2
}

let result = 0
for await (const line of io.readLines()) {
  const nums = line.split(',').map(Number)
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const options = [...range(min, max, true)].map((p) =>
    sum(nums.map((n) => calcNSum(Math.abs(p - n)))),
  )
  result += Math.min(...options)
}

io.write(result)
