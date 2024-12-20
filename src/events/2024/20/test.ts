import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  ###############
  #...#...#.....#
  #.#.#.#.#.###.#
  #S#...#.#.#...#
  #######.#.#.###
  #######.#.#...#
  #######.#.###.#
  ###..E#...#...#
  ###.#######.###
  #...###...#...#
  #.#####.#.###.#
  #.#...#.#.#...#
  #.#.#.#.#.#.###
  #...#...#...###
  ###############
`

await testPart(import('./1.js?url'), [
  [`min=100\n${input}`, 0],
  [`min=64\n${input}`, 1],
  [`min=20\n${input}`, 5],
  [`min=8\n${input}`, 14],
  [`min=2\n${input}`, 44],
])
await testPart(import('./2.js?url'), [
  [`min=76\n${input}`, 3],
  [`min=74\n${input}`, 7],
  [`min=50\n${input}`, 285],
])
