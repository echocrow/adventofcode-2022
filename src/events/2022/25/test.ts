import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  1=-0-2
  12111
  2=0=
  21
  2=01
  111
  20012
  112
  1=-1=
  1-12
  12
  1=
  122
`

await testPart(import('./1.js?url'), [input, '2=-1=0'])
