import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  32T3K 765
  T55J5 684
  KK677 28
  KTJJT 220
  QQQJA 483
`

await testPart(import('./1.js?url'), [input, 6440])
await testPart(import('./2.js?url'), [input, 5905])
