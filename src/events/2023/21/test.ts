import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  ...........
  .....###.#.
  .###.##..#.
  ..#.#...#..
  ....#.#....
  .##..S####.
  .##..#...#.
  .......##..
  .##.#.####.
  .##..##.##.
  ...........
`
const input1 = dedent`
  ...........
  ......##.#.
  .###..#..#.
  ..#.#...#..
  ....#.#....
  .....S.....
  .##......#.
  .......##..
  .##.#.####.
  .##...#.##.
  ...........
`

await testPart(import('./1.js?url'), [
  ['__steps=6\n' + input0, 16],
  [input0, 42],
])

// Note: Actual input of part 2 has some special properties that make it easier
// to solve, such as clear paths from the starting point in the center to all
// four edges. Therefore we use a modified version of the sample input, paired
// with various solutions generated via the solution to part 1.
await testPart(import('./2.js?url'), [
  ['__steps=1\n' + input1, 4],
  ['__steps=3\n' + input1, 15],
  ['__steps=5\n' + input1, 26],
  ['__steps=7\n' + input1, 48],
  ['__steps=9\n' + input1, 79],
  ['__steps=13\n' + input1, 141],
  ['__steps=15\n' + input1, 192],
  ['__steps=30\n' + input1, 723],
  ['__steps=31\n' + input1, 779],
  ['__steps=49\n' + input1, 1878],
  ['__steps=58\n' + input1, 2625],
  ['__steps=59\n' + input1, 2708],
  ['__steps=60\n' + input1, 2796],
  ['__steps=71\n' + input1, 3896],
  ['__steps=72\n' + input1, 3984],
  ['__steps=78\n' + input1, 4673],
])

await testPart(import('./2-visualize.js?url'), [
  [
    '__steps=13\n' + '__scale=1\n' + input1,
    dedent`
      ...........|...........|...........
      ......##.#.|......##.#.|......##.#.
      .###..#..#.|.###..#..#.|.###..#..#.
      ..#.#...#..|..#.#O..#..|..#.#...#..
      ....#.#....|....#.#....|....#.#....
      ...........|...O.O.O...|...........
      .##......#.|.##.O.O.O#.|.##......#.
      .......##..|.O.O.O.##..|.......##..
      .##.#.####.|O##.#.####O|.##.#.####.
      .##...#.##O|.##O.O#O##.|O##...#.##.
      .........O.|O.O.O.O.O.O|.O.........
      -----------+-----------+-----------
      ........O.O|.O.O.O.O.O.|O.O........
      ......##.#.|O.O.O.##O#O|.O.O..##.#.
      .###..#.O#O|.###.O#O.#.|O###..#..#.
      ..#.#O.O#O.|O.#.#.O.#.O|.O#O#O..#..
      ....#.#.O.O|.O.O#O#O.O.|O.O.#.#....
      ...O.O.O.O.|O.O.O.O.O.O|.O.O.O.O...
      .##.O.O.O#O|.##O.O.O.#.|O##.O.O..#.
      .....O.##O.|O.O.O.O##.O|.O.O.O.##..
      .##.#.####O|.##O#O####.|O##.#.####.
      .##...#.##.|O##.O.#.##O|.##O..#.##.
      ........O.O|.O.O.O.O.O.|O.O........
      -----------+-----------+-----------
      .........O.|O.O.O.O.O.O|.O.........
      ......##.#O|.O.O.O##.#.|O.....##.#.
      .###..#..#.|O###O.#.O#O|.###..#..#.
      ..#.#...#..|..#.#O.O#..|..#.#...#..
      ....#.#....|....#.#.O..|....#.#....
      ...........|...O.O.O...|...........
      .##......#.|.##.O.O..#.|.##......#.
      .......##..|.....O.##..|.......##..
      .##.#.####.|.##.#.####.|.##.#.####.
      .##...#.##.|.##...#.##.|.##...#.##.
      ...........|...........|...........
    `.replaceAll('.', ' '),
  ],
])
