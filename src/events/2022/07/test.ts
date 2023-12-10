import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  $ cd /
  $ ls
  dir a
  14848514 b.txt
  8504156 c.dat
  dir d
  $ cd a
  $ ls
  dir e
  29116 f
  2557 g
  62596 h.lst
  $ cd e
  $ ls
  584 i
  $ cd ..
  $ cd ..
  $ cd d
  $ ls
  4060174 j
  8033020 d.log
  5626152 d.ext
  7214296 k
`

await testPart(import('./1.js?url'), [input, 95437])
await testPart(import('./2.js?url'), [input, 24933642])
