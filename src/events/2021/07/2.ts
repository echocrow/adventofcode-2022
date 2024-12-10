import io from '#lib/io.js'
import {range, sum} from '#lib/iterable.js'
import {sumIntSeries} from '#lib/math.js'

let result = 0
for await (const line of io.readLines()) {
  const nums = line.split(',').map(Number)
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const options = [...range(min, max, true)].map((p) =>
    sum(nums.map((n) => sumIntSeries(0, Math.abs(p - n)))),
  )
  result += Math.min(...options)
}

io.write(result)
