import io from '#lib/io.js'

const BUYER_SECRETS = 2000

// Pruning is `mod 16777216`.
// This modulus is `2**24`, which effectively truncates all but the 23 least-
// significant bits.
const PRUNE_MASK = 16777216 - 1

function rand(num: number) {
  num ^= (num << 6) & PRUNE_MASK
  num ^= (num >>> 5) & PRUNE_MASK
  num ^= (num << 11) & PRUNE_MASK
  return num
}

let result = 0
for await (const line of io.readLines()) {
  let num = +line
  for (let i = 0; i < BUYER_SECRETS; i++) num = rand(num)
  result += num
}

io.write(result)
