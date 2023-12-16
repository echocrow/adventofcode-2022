import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`

await testPart(import('./1.js?url'), [
  ['HASH', 52],
  [input, 1320],
])

await testPart(import('./2.js?url'), [input, 145])
