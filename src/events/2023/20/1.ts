import io from '#lib/io.js'
import {fifo} from '#lib/iterable.js'
import {MemoMap} from '#lib/memo.js'

class Module {
  public sig = false
  public inputs = [] as (Module | undefined)[]
  public outputs = [] as (Module | undefined)[]
  constructor() {}
  process(from: Module): boolean {
    this.sig = from.sig
    return true
  }
}

class FlipFlipModule extends Module {
  process(from: Module): boolean {
    if (from.sig) return false
    this.sig = !this.sig
    return true
  }
}

class ConjunctionModule extends Module {
  #highs = new Set<Module>()
  process(from: Module): boolean {
    from.sig ? this.#highs.add(from) : this.#highs.delete(from)
    this.sig = this.#highs.size !== this.inputs.length
    return true
  }
}

// Parse definitions.
const modules = new Map<string, Module>()
const getModule = modules.get.bind(modules)
const inWires = new MemoMap<string, string[]>(() => [])
const outWires = new MemoMap<string, string[]>(() => [])
for await (const [_, pre, name, outs] of io.readRegExp(/([%&])?(\w+) -> (.+)/, {
  appendix: 'button -> broadcaster',
})) {
  const ModCls =
    pre === '%' ? FlipFlipModule
    : pre === '&' ? ConjunctionModule
    : Module
  modules.set(name!, new ModCls())
  const outNames = outs!.split(', ')
  for (const out of outNames) inWires.get(out).push(name!)
  outWires.get(name!).push(...outNames)
}
// Assign inputs & outputs.
for (const [name, mod] of modules) {
  mod.inputs = inWires.get(name).map(getModule)
  mod.outputs = outWires.get(name).map(getModule)
}

// Spam the button.
const signals: [lows: number, highs: number] = [0, 0]
for (let p = 1; p <= 1000; p++) {
  const queue = [[getModule('button')!, getModule('broadcaster')] as const]
  for (const [from, to] of fifo(queue)) {
    signals[+from.sig]++
    if (to?.process(from)) for (const next of to.outputs) queue.push([to, next])
  }
}

io.write(signals[0] * signals[1])
