import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  start-A
  start-b
  A-c
  A-b
  b-d
  A-end
  b-end
`
const input1 = dedent`
  dc-end
  HN-start
  start-kj
  dc-start
  dc-HN
  LN-dc
  HN-end
  kj-sa
  kj-HN
  kj-dc
`
const input2 = dedent`
  fs-end
  he-DX
  fs-he
  start-DX
  pj-DX
  end-zg
  zg-sl
  zg-pj
  pj-he
  RW-he
  fs-DX
  pj-RW
  zg-RW
  start-pj
  he-WI
  zg-he
  pj-fs
  start-RW
  `

await testPart(import('./1.js?url'), [
  [input0, 10],
  [input1, 19],
  [input2, 226],
])

await testPart(import('./2.js?url'), [
  [input0, 36],
  [input1, 103],
  [input2, 3509],
])
