import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  1,0,1~1,2,1
  0,0,2~2,0,2
  0,2,3~2,2,3
  0,0,4~0,2,4
  2,0,5~2,2,5
  0,1,6~2,1,6
  1,1,8~1,1,9
`
const input1 = dedent`
  1,0,1~1,2,1
  1,1,8~1,1,9
  0,0,2~2,0,2
  0,0,4~0,2,4
  0,2,3~2,2,3
  0,1,6~2,1,6
  2,0,5~2,2,5
`

await testPart(import('./1.js?url'), [
  [input0, 5],
  [input1, 5],
])

await testPart(import('./2.js?url'), [
  [input0, 7],
  [input1, 7],
  [
    dedent`
      0,0,1~0,0,2
      1,0,1~2,0,1
      1,0,2~1,0,2
      0,0,3~1,0,3
    `,
    1,
  ],
  [
    dedent`
      0,0,1~1,0,1
      0,0,2~0,0,3
      1,0,2~2,0,2
      1,0,3~1,0,3
      0,0,4~1,0,4
    `,
    5,
  ],
])
