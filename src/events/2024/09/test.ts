import {testPart} from '#lib/testing.js'

const input = '2333133121414131402'

await testPart(import('./1.js?url'), [input, 1928])
await testPart(import('./2.js?url'), [input, 2858])
