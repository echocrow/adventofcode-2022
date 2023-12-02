import io from 'lib/io.js'
import product from 'lib/product.js'
import sum from 'lib/sum.js'

enum Rocks {
  ore = 0,
  cly,
  obs,
  geo,
}
enum Robots {
  ore = 4,
  cly,
  obs,
  geo,
}
enum BlueprintKeys {
  oreOre,
  clyOre,
  obsOre,
  obsCly,
  geoOre,
  geoObs,
}

const MAX_BLUEPRINTS = 3

type Blueprint = Uint8Array & [number, number, number, number, number, number]
const blueprints: Blueprint[] = []
for await (const line of io.readLines()) {
  const bp = [...line.matchAll(/\d+/g)].map(Number).slice(1)
  blueprints.push(new Uint8Array(bp) as Blueprint)
  if (blueprints.length >= MAX_BLUEPRINTS) break
}

type Snap = Uint16Array &
  [number, number, number, number, number, number, number, number, number]

function* next(bp: Blueprint, snap: Snap) {
  const nextSnap = snap.slice() as Snap
  nextSnap[Rocks.ore] += snap[Robots.ore]
  nextSnap[Rocks.cly] += snap[Robots.cly]
  nextSnap[Rocks.obs] += snap[Robots.obs]
  nextSnap[Rocks.geo] += snap[Robots.geo]
  if (
    bp[BlueprintKeys.geoOre] <= snap[Rocks.ore] &&
    bp[BlueprintKeys.geoObs] <= snap[Rocks.obs]
  ) {
    const opt = nextSnap.slice() as Snap
    opt[Rocks.ore] -= bp[BlueprintKeys.geoOre]
    opt[Rocks.obs] -= bp[BlueprintKeys.geoObs]
    opt[Robots.geo] += 1
    yield opt
  }
  if (
    bp[BlueprintKeys.obsOre] <= snap[Rocks.ore] &&
    bp[BlueprintKeys.obsCly] <= snap[Rocks.cly]
  ) {
    const opt = nextSnap.slice() as Snap
    opt[Rocks.ore] -= bp[BlueprintKeys.obsOre]
    opt[Rocks.cly] -= bp[BlueprintKeys.obsCly]
    opt[Robots.obs] += 1
    yield opt
  }
  if (bp[BlueprintKeys.clyOre] <= snap[Rocks.ore]) {
    const opt = nextSnap.slice() as Snap
    opt[Rocks.ore] -= bp[BlueprintKeys.clyOre]
    opt[Robots.cly] += 1
    yield opt
  }
  if (bp[BlueprintKeys.oreOre] <= snap[Rocks.ore]) {
    const opt = nextSnap.slice() as Snap
    opt[Rocks.ore] -= bp[BlueprintKeys.oreOre]
    opt[Robots.ore] += 1
    yield opt
  }
  yield nextSnap
}

function prioritize(a: Snap, b: Snap): number {
  return (
    b[Rocks.geo] - a[Rocks.geo] ||
    b[Robots.geo] - a[Robots.geo] ||
    b[Rocks.obs] - a[Rocks.obs] ||
    b[Robots.obs] - a[Robots.obs] ||
    b[Rocks.cly] - a[Rocks.cly] ||
    b[Robots.cly] - a[Robots.cly] ||
    b[Rocks.ore] - a[Rocks.ore] ||
    b[Robots.ore] - a[Robots.ore]
  )
}

const TIME = 32
const PRUNE = 100000
const INITIAL_SNAP = new Uint16Array([0, 0, 0, 0, 1, 0, 0, 0]) as Snap

function evalBlueprint(bp: Blueprint) {
  let opts: Snap[] = [INITIAL_SNAP]
  for (let t = 0; t < TIME; t++) {
    let nextOpts: Snap[] = [INITIAL_SNAP]
    for (const opt of opts) {
      nextOpts.push(...next(bp, opt))
    }
    nextOpts = nextOpts.sort(prioritize).slice(0, PRUNE)
    opts = nextOpts
  }
  return opts.reduce((max, o) => (o[Rocks.geo] > max ? o[Rocks.geo] : max), 0)
}

const blueprintGeos = blueprints.map(evalBlueprint)
const totalQuality = product(blueprintGeos)

io.write(totalQuality)
