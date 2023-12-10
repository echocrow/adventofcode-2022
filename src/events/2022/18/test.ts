import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  2,2,2
  1,2,2
  3,2,2
  2,1,2
  2,3,2
  2,2,1
  2,2,3
  2,2,4
  2,2,6
  1,2,5
  3,2,5
  2,1,5
  2,3,5
`

await testPart(import('./1.js?url'), [
  [
    dedent`
      1,1,1
      2,1,1
    `,
    10,
  ],
  [input, 64],
])

await testPart(import('./2.js?url'), [input, 58])
