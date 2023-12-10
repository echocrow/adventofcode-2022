import {testPart} from '#lib/testing.js'

await testPart(import('./1.js?url'), [
  ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
  ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
  ['nppdvjthqldpwncqszvftbrmjlhg', 6],
  ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
  ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
])

await testPart(import('./2.js?url'), [
  ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
  ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
  ['nppdvjthqldpwncqszvftbrmjlhg', 23],
  ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
  ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
])
