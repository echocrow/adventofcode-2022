import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  19, 13, 30 @ -2,  1, -2
  18, 19, 22 @ -1, -1, -2
  20, 25, 34 @ -2, -2, -4
  12, 31, 28 @ -1, -2, -1
  20, 19, 15 @  1, -5, -3
`
const input0a = '19, 13, 30 @ -2,  1, -2'
const input0b = '18, 19, 22 @ -1, -1, -2'
const input0c = '20, 25, 34 @ -2, -2, -4'
const input0d = '12, 31, 28 @ -1, -2, -1'
const input0e = '20, 19, 15 @  1, -5, -3'
const sampleCfg = '__minArea=7\n' + '__maxArea=27\n'

await testPart(import('./1.js?url'), [
  [sampleCfg + input, 2],
  [sampleCfg + `${input0a}\n${input0b}\n`, 1],
  [sampleCfg + `${input0a}\n${input0c}\n`, 1],
  [sampleCfg + `${input0a}\n${input0d}\n`, 0],
  [sampleCfg + `${input0a}\n${input0e}\n`, 0],
  [sampleCfg + `${input0b}\n${input0c}\n`, 0],
  [sampleCfg + `${input0b}\n${input0d}\n`, 0],
  [sampleCfg + `${input0b}\n${input0e}\n`, 0],
  [sampleCfg + `${input0c}\n${input0d}\n`, 0],
  [sampleCfg + `${input0c}\n${input0e}\n`, 0],
  [sampleCfg + `${input0d}\n${input0e}\n`, 0],
])

await testPart(import('./2.js?url'), [input, 47])
