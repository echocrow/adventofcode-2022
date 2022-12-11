import IO from 'lib/io.js'
import product from 'lib/product.js'
import {joinRegExp} from 'lib/regexp.js'
import sort from 'lib/sort.js'

const io = new IO()

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
    item = Math.floor(item / 3)
    return item
  }

  getPal(item: number, pals: Monkey[]): Monkey | undefined {
    const idx = item % this.testDiv === 0 ? this.pals[0] : this.pals[1]
    return pals[idx]
  }
}

function runRound(monkeys: Monkey[]) {
  for (const monkey of monkeys) {
    for (let item of monkey.items) {
      item = monkey.inspect(item)
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

for (let i = 0; i < 20; i++) runRound(monkeys)

const inspections = sort(monkeys.map((m) => m.inspections))
  .reverse()
  .slice(0, 2)
const monkeyBusiness = product(inspections)

io.write(monkeyBusiness)
