import io from '#lib/io.js'
import {fifo, reduce} from '#lib/iterable.js'
import {lcm} from '#lib/math.js'
import {MemoMap} from '#lib/memo.js'

class Module {
  public sig = false
  public inputs = [] as (Module | undefined)[]
  public outputs = [] as (Module | undefined)[]
  constructor(public readonly name: string) {}
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
  modules.set(name!, new ModCls(name!))
  const outNames = outs!.split(', ')
  for (const out of outNames) inWires.get(out).push(name!)
  outWires.get(name!).push(...outNames)
}
// Assign inputs & outputs.
for (const [name, mod] of modules) {
  mod.inputs = inWires.get(name).map(getModule)
  mod.outputs = outWires.get(name).map(getModule)
}

// Determine tail flip-flop gates.
const endInputs = inWires.get('rx')
const tailMods = new Set(endInputs.flatMap((name) => getModule(name)?.inputs))
const tailRounds = new Map<Module, number>()

// Spam the button.
spam: for (let p = 1; p <= 10000; p++) {
  const queue = [[getModule('button')!, getModule('broadcaster')] as const]
  for (const [from, to] of fifo(queue)) {
    // Check for HIGH signals from tail modules.
    if (from.sig && tailMods.has(from) && !tailRounds.has(from)) {
      tailRounds.set(from, p)
      if (tailRounds.size === tailMods.size) break spam
    }
    if (to?.process(from)) for (const next of to.outputs) queue.push([to, next])
  }
}

io.write(reduce(tailRounds.values(), lcm))
