import io from '#lib/io.js'
import {bigSum} from '#lib/sum.js'

const DAYS = 256
const REFRESH = 6
const SPAWN = 8
const MAX = SPAWN

let result = BigInt(0)
for await (const line of io.readLines()) {
  let pool = new BigUint64Array(MAX + 1)

  let fishes = line.split(',').map(Number)
  for (const f of fishes) pool[f]++

  for (let d = 0; d < DAYS; d++) {
    const spawns = pool[0]!
    pool.set(pool.slice(1))
    pool[REFRESH] += spawns
    pool[SPAWN] = spawns
  }

  result = bigSum(pool)
}

io.write(result.toString())
