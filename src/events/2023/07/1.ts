import io from '#lib/io.js'

const faceVals = new Map(
  ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'].map(
    (f, i) => [f, i] as const,
  ),
)

function getType(repeats: Uint8Array) {
  if (repeats[4]) return 6 // five of a kind.
  if (repeats[3]) return 5 // four of a kind.
  if (repeats[2]) return 3 + repeats[1]! // full house / three of a kind.
  if (repeats[1]) return repeats[1] // two pair / one pair.
  return 0 // high card.
}

const faceCounts = new Uint8Array(faceVals.size)
const repeats = new Uint8Array(5)
const hands = (await Array.fromAsync(io.readLines())).map((line) => {
  const [hand = '', bidStr = ''] = line.split(' ')

  // Count faces + hand value.
  faceCounts.fill(0)
  let value = 0
  for (const char of hand) {
    const charVal = faceVals.get(char)!
    faceCounts[charVal]!++
    value = value * faceVals.size + charVal
  }

  // Count repeats.
  repeats.fill(0)
  for (const count of faceCounts) if (count) repeats[count - 1]!++

  const type = getType(repeats)
  return {hand, bid: Number(bidStr), type, value}
})
hands.sort((a, b) => a.type - b.type || a.value - b.value)

const result = hands.reduce((res, {bid}, i) => res + bid * (i + 1), 0)
io.write(result)
