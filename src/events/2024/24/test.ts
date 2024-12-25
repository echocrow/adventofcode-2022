import {dedent, testPart} from '#lib/testing.js'

await testPart(import('./1.js?url'), [
  [
    dedent`
      x00: 1
      x01: 1
      x02: 1
      y00: 0
      y01: 1
      y02: 0

      x00 AND y00 -> z00
      x01 XOR y01 -> z01
      x02 OR y02 -> z02
    `,
    4,
  ],
  [
    dedent`
      x00: 1
      x01: 0
      x02: 1
      x03: 1
      x04: 0
      y00: 1
      y01: 1
      y02: 1
      y03: 1
      y04: 1

      ntg XOR fgs -> mjb
      y02 OR x01 -> tnw
      kwq OR kpj -> z05
      x00 OR x03 -> fst
      tgd XOR rvg -> z01
      vdt OR tnw -> bfw
      bfw AND frj -> z10
      ffh OR nrd -> bqk
      y00 AND y03 -> djm
      y03 OR y00 -> psh
      bqk OR frj -> z08
      tnw OR fst -> frj
      gnj AND tgd -> z11
      bfw XOR mjb -> z00
      x03 OR x00 -> vdt
      gnj AND wpb -> z02
      x04 AND y00 -> kjc
      djm OR pbm -> qhw
      nrd AND vdt -> hwm
      kjc AND fst -> rvg
      y04 OR y02 -> fgs
      y01 AND x02 -> pbm
      ntg OR kjc -> kwq
      psh XOR fgs -> tgd
      qhw XOR tgd -> z09
      pbm OR djm -> kpj
      x03 XOR y03 -> ffh
      x00 XOR y04 -> ntg
      bfw OR bqk -> z06
      nrd XOR fgs -> wpb
      frj XOR qhw -> z04
      bqk OR frj -> z07
      y03 OR x01 -> nrd
      hwm AND bqk -> z03
      tgd XOR rvg -> z12
      tnw OR pbm -> gnj
    `,
    2024,
  ],
])
await testPart(import('./2.js?url'), [
  [
    dedent`
      x00: 0

      x00 AND y00 -> a00
      x00 XOR y00 -> z00
      x01 AND y01 -> a01
      x01 XOR y01 -> e01
      e01 XOR a00 -> z01
      e01 AND a00 -> b01
      a01 OR b01 -> c01
      x02 AND y02 -> a02
      x02 XOR y02 -> e02
      c01 XOR e02 -> z02
      c01 AND e02 -> b02
      a02 OR b02 -> c02
      x03 AND y03 -> a03
      x03 XOR y03 -> e03
      e03 XOR c02 -> z03
      e03 AND c02 -> b03
      a03 OR b03 -> c03
      x04 AND y04 -> a04
      x04 XOR y04 -> e04
      e04 XOR c03 -> z04
      e04 AND c03 -> b04
      a04 OR b04 -> c04
      x05 AND y05 -> a05
      x05 XOR y05 -> e05
      e05 XOR c04 -> z05
      e05 AND c04 -> b05
      a05 OR b05 -> c05
      x06 AND y06 -> a06
      x06 XOR y06 -> e06
      e06 XOR c05 -> z06
      e06 AND c05 -> b06
      a06 OR b06 -> z07
    `,
    '',
  ],
  [
    dedent`
      x00: 0

      x00 AND y00 -> a00
      x00 XOR y00 -> z00
      x01 AND y01 -> a01
      x01 XOR y01 -> z05
      e01 XOR a00 -> z01
      e01 AND a00 -> b01
      a01 OR b01 -> c01
      x02 AND y02 -> a02
      x02 XOR y02 -> e02
      c01 XOR e02 -> a04
      c01 AND e02 -> b02
      a02 OR b02 -> c02
      x03 AND y03 -> a03
      x03 XOR y03 -> e03
      c02 XOR e03 -> z03
      e03 AND c02 -> b03
      a03 OR b03 -> c03
      x04 AND y04 -> z02
      x04 XOR y04 -> e04
      c03 XOR e04 -> z04
      e04 AND c03 -> b04
      a04 OR b04 -> c04
      x05 AND y05 -> a05
      x05 XOR y05 -> e05
      c04 XOR e05 -> e01
      c04 AND e05 -> b05
      b05 OR a05 -> c05
      y06 AND x06 -> a06
      x06 XOR y06 -> e06
      e06 XOR c05 -> z06
      c05 AND e06 -> b06
      b06 OR a06 -> z07
    `,
    'a04,e01,z02,z05',
  ],
  [
    dedent`
      x00: 0

      x00 AND y00 -> z00
      x00 XOR y00 -> a00
      x01 AND y01 -> a01
      x01 XOR y01 -> e01
      e01 XOR a00 -> z01
      e01 AND a00 -> b01
      a01 OR b01 -> c01
      x02 AND y02 -> a02
      x02 XOR y02 -> e02
      c01 XOR e02 -> z02
      c01 AND e02 -> b02
      a02 OR b02 -> c02
      x03 AND y03 -> a03
      x03 XOR y03 -> e03
      e03 XOR c02 -> z03
      e03 AND c02 -> c03
      a03 OR b03 -> b03
      x04 AND y04 -> a04
      x04 XOR y04 -> e04
      e04 XOR c03 -> z04
      e04 AND c03 -> b04
      a04 OR b04 -> c04
      x05 AND y05 -> a05
      x05 XOR y05 -> e05
      e05 XOR c04 -> z05
      e05 AND c04 -> b05
      a05 OR b05 -> c05
      x06 AND y06 -> a06
      x06 XOR y06 -> e06
      e06 XOR c05 -> z06
      e06 AND c05 -> z07
      a06 OR b06 -> b06
    `,
    'a00,b03,b06,c03,z00,z07',
  ],
  [
    dedent`
      x00: 0

      x00 AND y00 -> a00
      x00 XOR y00 -> z07
      x01 AND y01 -> a01
      x01 XOR y01 -> e01
      e01 XOR a00 -> z01
      e01 AND a00 -> b01
      a01 OR b01 -> c01
      x02 AND y02 -> a02
      x02 XOR y02 -> e02
      c01 XOR e02 -> z02
      c01 AND e02 -> b02
      a02 OR b02 -> c02
      x03 AND y03 -> a03
      x03 XOR y03 -> e03
      e03 XOR c02 -> z03
      e03 AND c02 -> b03
      a03 OR b03 -> c03
      x04 AND y04 -> a04
      x04 XOR y04 -> e04
      e04 XOR c03 -> z04
      e04 AND c03 -> b04
      a04 OR b04 -> c04
      x05 AND y05 -> a05
      x05 XOR y05 -> e05
      e05 XOR c04 -> z05
      e05 AND c04 -> b05
      a05 OR b05 -> c05
      x06 AND y06 -> a06
      x06 XOR y06 -> e06
      e06 XOR c05 -> z06
      e06 AND c05 -> b06
      a06 OR b06 -> z00
    `,
    'z00,z07',
  ],
])
