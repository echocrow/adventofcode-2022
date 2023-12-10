import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  vJrwpWtwJgWrhcsFMMfFFhFp
  jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
  PmmdzqPrVvPwwTWBwg
  wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
  ttgJtRGJQctTZtZT
  CrZsJsPPZsGzwwsLwLmpwMDw
`

await testPart(import('./1.js?url'), [input, 157])
await testPart(import('./2.js?url'), [input, 70])
