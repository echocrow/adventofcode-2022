import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  11,7
  p=0,4 v=3,-3
  p=6,3 v=-1,-3
  p=10,3 v=-1,2
  p=2,0 v=2,-1
  p=0,0 v=1,3
  p=3,0 v=-2,-2
  p=7,6 v=-1,-3
  p=3,0 v=-1,-2
  p=9,3 v=2,3
  p=7,3 v=-1,2
  p=2,4 v=2,-3
  p=9,5 v=-3,-3
`

await testPart(import('./1.js?url'), [input, 12])

// Not a real test, but the answer the current implementation happens to give.
await testPart(import('./2.js?url'), [input, 6])
