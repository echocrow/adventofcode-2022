import IO from 'lib/io.js'
import isset from 'lib/isset.js'
import memoize from 'lib/memo.js'
import {MemoQueue} from 'lib/queue.js'

const io = new IO()

type Valve = {
  id: number
  name: string
  rate: number
  tunnels: Set<string>
}

// Parse.
const valves = new Map<string, Valve>()
const reg =
  /Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<tunnels>[\w, ]+)/
let v = 0
for await (const {groups = {}} of io.readRegExp(reg)) {
  const name = groups.valve ?? ''
  const rate = Number(groups.rate ?? '')
  const tunnels = new Set((groups.tunnels ?? '').split(', '))
  const id = rate ? v++ : 0
  valves.set(name, {id, name, rate, tunnels})
}
const workingValves = [...valves.values()].filter((v) => v.rate)

// Collect shortest paths between unjammed valves.
function calcNextValves(start: string) {
  const costs = new Uint8Array(workingValves.length)
  const queue = new MemoQueue<string>().enqueue(1, start)
  const remaining = new Set(valves.keys())
  remaining.delete(start)
  for (const {cost, item} of queue) {
    for (const cName of valves.get(item)!.tunnels) {
      const cValve = valves.get(cName)!
      const cId = cValve.id
      if (!remaining.delete(cName)) continue
      if (cValve.rate) costs[cId] = cost + 1
      queue.enqueue(cost + 1, cName)
    }
  }
  const startValve = valves.get(start)!
  return [...costs.entries()].filter(([id]) => id !== startValve.id)
}
const findPathCosts = memoize(calcNextValves)

// Initial state
const START = 'AA'
const TIME = 30
const START_OPT = {
  id: -1,
  time: TIME,
  rate: 0,
  opened: new Set<number>(),
}

// Find best run.
type Option = Readonly<typeof START_OPT>
function evalOption(
  from: Option,
  toId: number,
  cost: number,
): Option | undefined {
  if (from.opened.has(toId)) return
  const time = from.time - cost
  if (time <= 0) return
  const nValve = workingValves[toId]!
  const rate = from.rate + nValve.rate * time
  const opened = new Set([...from.opened, toId])
  return {id: toId, time, rate, opened}
}
const queue = [...findPathCosts(START)]
  .map(([id, cost]) => evalOption(START_OPT, id, cost))
  .filter(isset)
let best = START_OPT
let checks = 0n
let item: Option | undefined
while ((item = queue.pop())) {
  checks++
  const valve = workingValves[item.id]
  for (const [nId, cost] of findPathCosts(valve?.name ?? START)) {
    const option = evalOption(item, nId, cost)
    if (!option) continue
    if (option.rate > best.rate) best = option
    queue.push(option)
  }
}

io.write(best.rate)
