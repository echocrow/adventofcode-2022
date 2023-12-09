import {dedent, testDay} from '#lib/testing.js'

const input = dedent`
  Time:      7  15   30
  Distance:  9  40  200
`

testDay(__dirname, [
  {part: 1, input, expect: 288},
  {part: 2, input, expect: 71503},
])
