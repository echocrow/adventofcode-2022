import IO from 'lib/io.js'
import product from 'lib/product.js'
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
const reader = io.readLines()
for await (const line of reader) {
  if (!line) continue
  let items = (await reader.next()).value ?? ''
  let ops = (await reader.next()).value ?? ''
  let test = (await reader.next()).value ?? ''
  let pal0 = (await reader.next()).value ?? ''
  let pal1 = (await reader.next()).value ?? ''
  monkeys.push(
    new Monkey(
      items.slice(18).split(', ').map(Number),
      ops[23] === '*',
      Number(ops.slice(25)),
      Number(test.slice(21)),
      [Number(pal0.slice(29)), Number(pal1.slice(30))],
    ),
  )
}

for (let i = 0; i < 20; i++) runRound(monkeys)

const inspections = sort(monkeys.map((m) => m.inspections))
  .reverse()
  .slice(0, 2)
const monkeyBusiness = product(inspections)

io.write(monkeyBusiness)
