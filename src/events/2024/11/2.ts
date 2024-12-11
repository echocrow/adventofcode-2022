import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'
import {countDigits} from '#lib/math.js'

const initial = ((await io.readLine()) ?? '').split(' ').map(Number)
const maxBlinks = Number(await io.readLine()) || 75

function* blink(stone: number): Generator<number> {
  if (!stone) return yield 1

  const digits = countDigits(stone)
  if (digits % 2) return yield stone * 2024

  const pow10 = 10 ** (digits / 2)
  const rightHalf = stone % pow10
  yield rightHalf
  yield (stone - rightHalf) / pow10
}

const cache = new Map<number, number>()
function countStones(blinks: number, stone: number): number {
  if (!blinks) return 1

  const cid = stone * maxBlinks + blinks
  const cached = cache.get(cid)
  if (cached) return cached

  const result = sum(blink(stone).map((s) => countStones(blinks - 1, s)))
  cache.set(cid, result)
  return result
}

const result = sum(initial.map((stone) => countStones(maxBlinks, stone)))
io.write(result)
