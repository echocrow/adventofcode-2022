import io from 'lib/io.js'

const DAYS = 80
const REFRESH = 6
const SPAWN = 8

class Uint8Slice extends Uint8Array {
  sliceLength = this.length
  fill(n: number, start?: number | undefined, end?: number | undefined) {
    end ??= this.sliceLength
    if (end <= this.length) {
      this.sliceLength = Math.max(this.sliceLength, end)
      return super.fill(n, start, end)
    }

    const slice = this.expand(end)
    slice.fill(n, start, end)
    return slice as this
  }
  expand(to: number) {
    if (to <= this.length) {
      this.sliceLength = to
      return this
    }
    const newLength = Math.max(to, this.length * 2 || 4)
    const slice = new Uint8Slice(newLength)
    slice.set(this)
    slice.sliceLength = to
    return slice
  }
}

let result = 0
for await (const line of io.readLines()) {
  let fishes = new Uint8Slice(line.split(',').map(Number))
  for (let d = 0; d < DAYS; d++) {
    const len = fishes.sliceLength
    let spawns = 0
    for (let f = len - 1; f >= 0; f--) {
      const fish = fishes[f]
      if (fish) {
        fishes[f] = fish - 1
      } else {
        fishes[f] = REFRESH
        spawns++
      }
    }
    if (spawns) fishes = fishes.fill(SPAWN, len, len + spawns)
  }
  result = fishes.sliceLength
}

io.write(result)
