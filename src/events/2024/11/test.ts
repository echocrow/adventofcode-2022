import {testPart} from '#lib/testing.js'

const input = '125 17'

await testPart(import('./1.js?url'), [input, 55312])
await testPart(import('./2.js?url'), [`${input}\n75`, 65601038650482])
