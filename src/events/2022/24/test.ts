import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  #.#####
  #.....#
  #>....#
  #.....#
  #...v.#
  #.....#
  #####.#
`
const input1 = dedent`
  #.######
  #>>.<^<#
  #.<..<<#
  #>v.><>#
  #<^v^^>#
  ######.#
`

await testPart(import('./1.js?url'), [
  [input0, 10],
  [input1, 18],
])

await testPart(import('./2.js?url'), [
  [input0, 30],
  [input1, 54],
])
