import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  029A
  980A
  179A
  456A
  379A
`

await testPart(import('./1.js?url'), [
  ['029A', 68 * 29],
  ['980A', 60 * 980],
  ['179A', 68 * 179],
  ['456A', 64 * 456],
  ['379A', 64 * 379],
  [input, 126384],
])
await testPart(import('./2.js?url'), [input, 154115708116294])
