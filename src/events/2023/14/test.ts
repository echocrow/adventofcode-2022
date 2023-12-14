import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  O....#....
  O.OO#....#
  .....##...
  OO.#O....O
  .O.....O#.
  O.#..O.#.#
  ..O..#O..O
  .......O..
  #....###..
  #OO..#....
`

await testPart(import('./1.js?url'), [input, 136])

await testPart(import('./2.js?url'), [
  [input, 64],
  ['__spins=1\n' + input, 87],
  ['__spins=2\n' + input, 69],
  ['__spins=3\n' + input, 69],
])
