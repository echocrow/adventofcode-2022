import {dedent, testDay} from '#lib/testing.js'

const input = dedent`
  467..114..
  ...*......
  ..35..633.
  ......#...
  617*......
  .....+.58.
  ..592.....
  ......755.
  ...$.*....
  .664.598..
`

testDay(__dirname, [
  {part: 1, input, expect: 4361},
  {part: 2, input, expect: 467835},
])
