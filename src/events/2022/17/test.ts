import {testPart} from '#lib/testing.js'

const input = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'

await testPart(import('./1.js?url'), [input, 3068])
await testPart(import('./2.js?url'), [input, 1514285714288])
