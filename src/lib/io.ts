import {createReadStream, writeFileSync, openSync} from 'node:fs'
import path from 'node:path'
import {createInterface} from 'node:readline'

type WriteData = Parameters<typeof writeFileSync>[1]

export default class IO {
  #inPath: string
  #outPath: string
  #outFileDesc: number | undefined

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
    this.#outFileDesc ??= openSync(this.#outPath, 'w+')
    if (typeof data === 'number') data = String(data)
    writeFileSync(this.#outFileDesc, data)
  }
}
