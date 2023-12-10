import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  Blueprint 1:
    Each ore robot costs 4 ore.
    Each clay robot costs 2 ore.
    Each obsidian robot costs 3 ore and 14 clay.
    Each geode robot costs 2 ore and 7 obsidian.

  Blueprint 2:
    Each ore robot costs 2 ore.
    Each clay robot costs 3 ore.
    Each obsidian robot costs 3 ore and 8 clay.
    Each geode robot costs 3 ore and 12 obsidian.
`
  .replaceAll(/\n[^\S\n]+/g, ' ')
  .replaceAll(/\n{2,}/g, '\n')

await testPart(import('./1.js?url'), [input, 33])
await testPart(import('./2.js?url'), [input, 56 * 62])
