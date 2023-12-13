import {dedent, testPart} from '#lib/testing.js'

const inputP1 = dedent`
  #.##..##.
  ..#.##.#.
  ##......#
  ##......#
  ..#.##.#.
  ..##..##.
  #.#.##.#.
`
const inputP2 = dedent`
  #...##..#
  #....#..#
  ..##..###
  #####.##.
  #####.##.
  ..##..###
  #....#..#
`
const input = inputP1 + '\n\n' + inputP2

await testPart(import('./1.js?url'), [
  [inputP1, 5],
  [inputP2, 400],
  [input, 405],
])

await testPart(import('./2.js?url'), [
  [inputP1, 300],
  [inputP2, 100],
  [input, 400],
  [
    dedent`
      ##....#
      #..####
      #..####
    `,
    5,
  ],
  [
    dedent`
      .#...#.
      #...##.
      ..#.#..
      ###..##
      ###.###
      ..#.#..
    `,
    400,
  ],
  [
    dedent`
      .##...#
      .##...#
      ..#.#..
      ###..##
      ###.###
      ..#.#..
    `,
    400,
  ],
])
