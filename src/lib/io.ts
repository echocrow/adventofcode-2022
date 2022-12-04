import {createReadStream, writeFileSync} from 'node:fs'
import path from 'node:path'
import {createInterface} from 'node:readline'

type WriteData = Parameters<typeof writeFileSync>[1]

export default class IO {
  #inPath: string
  #outPath: string

  constructor(dir = './io', input = 'in.txt', output = 'out.txt') {
    this.#inPath = path.join(dir, input)
    this.#outPath = path.join(dir, output)
  }

  async *readLines() {
    yield* createInterface({
      input: createReadStream(this.#inPath),
    })
  }

  write(data: WriteData | number) {
    if (typeof data === 'number') data = String(data)
    writeFileSync(this.#outPath, data)
  }
}
