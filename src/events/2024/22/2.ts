import io from '#lib/io.js'
import {max} from '#lib/iterable.js'

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

// Keep score of the sum of every monkey's first offer per "change ID".
//
// A change ID is a positive integer uniquely identifying a sequence of four
// consecutive offer changes. Because each individual change can only range from
// -9 to 9 (inclusive), there are exactly 19 distinct change values. For
// convenience, we map these to `0..18`; this way, we can treat combinations of
// changes as base-19 numbers.
//
// Thus, for a sequence of four consecutive changes, there are `19**4` distinct
// possible combinations.
const allTimeMaxOffers = new Uint16Array(19 ** 4)
const seenChangeIds = new Uint8Array(allTimeMaxOffers.length)

for await (const line of io.readLines()) {
  let num = +line
  let offer = num % 10
  let changeId = 0
  seenChangeIds.fill(0)
  for (let i = 0; i < BUYER_SECRETS; i++) {
    num = rand(num)

    const change = (num % 10) - offer
    offer += change

    // Calculate rolling change ID.
    // This drops the most-significant change number, shifts by one base, and
    // adds the current change as the new least-significant number.
    changeId = (changeId % 19 ** 3) * 19 + (change + 9)
    if (seenChangeIds[changeId]) continue

    seenChangeIds[changeId] = 1
    allTimeMaxOffers[changeId]! += offer
  }
}

const result = max(allTimeMaxOffers)
io.write(result)
