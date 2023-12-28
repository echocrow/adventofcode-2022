import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  jqt: rhn xhk nvd
  rsh: frs pzl lsr
  xhk: hfx
  cmg: qnr nvd lhk bvb
  rhn: xhk bvb hfx
  bvb: xhk hfx
  pzl: lsr hfx nvd
  qnr: nvd
  ntq: jqt hfx bvb xhk
  nvd: lhk
  lsr: lhk
  rzs: qnr cmg lsr rsh
  frs: qnr lhk lsr
`

await testPart(import('./1.js?url'), [input, 54])
