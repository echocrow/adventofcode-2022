import IO from 'lib/io.js'
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
// [valve, time, rate, opened]
const START_OPT = new Uint16Array([-1, TIME, 0, 0])

// Find best run.
const valveCombos = 2 ** workingValves.length
const allOpened = valveCombos - 1
const optLen = START_OPT.length
const queue = new Uint16Array(optLen * 128)
let q = 0
let item = START_OPT.slice()
let best = 0
function evalOptions(): void {
  const vId = item[0]!
  const time = item[1]!
  const rate = item[2]!
  const opened = item[3]!
  if (rate > best) best = rate
  if (opened === allOpened) return
  const toCosts = findPathCosts(workingValves[vId]?.name ?? START)
  for (const [toId, cost] of toCosts) {
    const toIdBit = 1 << toId
    if (opened & toIdBit) continue
    const toTime = time - cost
    if (toTime <= 0) continue
    const nValve = workingValves[toId]!
    const to = queue.subarray(q, q + optLen)
    to[0] = toId
    to[1] = toTime
    to[2] = rate + nValve.rate * toTime
    to[3] = opened | toIdBit
    q += optLen
  }
}
evalOptions()
while (q > 0) {
  q -= optLen
  item.set(queue.subarray(q, q + optLen))
  evalOptions()
  if (q > queue.length) throw 'out of range'
}

io.write(best)
