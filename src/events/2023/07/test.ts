import {dedent, testDay} from '#lib/testing.js'

const input = dedent`
  32T3K 765
  T55J5 684
  KK677 28
  KTJJT 220
  QQQJA 483
`

testDay(__dirname, [
  {part: 1, input, expect: 6440},
  {part: 2, input, expect: 5905},
])
