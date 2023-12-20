import io from '#lib/io.js'
import {product} from '#lib/iterable.js'
import {joinRegExp} from '#lib/regexp.js'
import sort from '#lib/sort.js'

class Monkey {
  constructor(
    public items: number[],
    public opMulti: boolean,
    public opDelta: number,
    public testDiv: number,
    public pals: [number, number],
    public inspections = 0,
  ) {}

  inspect(item: number): number {
    this.inspections++
    const delta = isNaN(this.opDelta) ? item : this.opDelta
    item = this.opMulti ? item * delta : item + delta
    return item
  }

  getPal(item: number, pals: Monkey[]): Monkey | undefined {
    const idx = item % this.testDiv === 0 ? this.pals[0] : this.pals[1]
    return pals[idx]
  }
}

function runRound(monkeys: Monkey[], maxWorry: number) {
  for (const monkey of monkeys) {
    for (let item of monkey.items) {
      item = monkey.inspect(item) % maxWorry
      const pal = monkey.getPal(item, monkeys)
      pal?.items.push(item)
    }
    monkey.items = []
  }
}

const monkeys: Monkey[] = []
const monkeyRe = joinRegExp([
  /Monkey \d+:/,
  /  Starting items: (?<items>\d+[, \d]+)/,
  /  Operation: new = old (?<op>[+*]) (?<opDelta>\d+|old)/,
  /  Test: divisible by (?<div>\d+)/,
  /    If true: throw to monkey (?<pal0>\d+)/,
  /    If false: throw to monkey (?<pal1>\d+)/,
])
for await (const {groups = {}} of io.readRegExp(monkeyRe)) {
  monkeys.push(
    new Monkey(
      groups.items?.split(', ').map(Number) ?? [],
      groups.op === '*',
      Number(groups.opDelta),
      Number(groups.div),
      [Number(groups.pal0), Number(groups.pal1)],
    ),
  )
}
const maxWorry = product(monkeys.map((m) => m.testDiv))

for (let i = 0; i < 10000; i++) runRound(monkeys, maxWorry)

const inspections = sort(monkeys.map((m) => m.inspections))
  .reverse()
  .slice(0, 2)
const monkeyBusiness = product(inspections)

io.write(monkeyBusiness)
