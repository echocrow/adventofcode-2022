import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  6,10
  0,14
  9,10
  0,3
  10,4
  4,11
  6,0
  6,12
  4,1
  0,13
  10,12
  3,4
  3,0
  8,4
  1,10
  2,14
  8,10
  9,0

  fold along y=7
  fold along x=5
`

await testPart(import('./1.js?url'), [input, 17])
await testPart(import('./2.js?url'), [
  input,
  dedent`
    #####
    #...#
    #...#
    #...#
    #####
    .....
    .....
  `
    .replaceAll('#', '█')
    .replaceAll('.', ' '),
])
