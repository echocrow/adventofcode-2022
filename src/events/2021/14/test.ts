import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  NNCB

  CH -> B
  HH -> N
  CB -> H
  NH -> C
  HB -> C
  HC -> B
  HN -> C
  NN -> C
  BH -> H
  NC -> B
  NB -> B
  BN -> B
  BB -> N
  BC -> B
  CC -> N
  CN -> C
`

await testPart(import('./1.js?url'), [input, 1588])
await testPart(import('./2.js?url'), [input, 2188189693529])
