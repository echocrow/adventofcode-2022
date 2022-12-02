import {createReadStream} from 'node:fs'
import path from 'node:path'
import {createInterface} from 'node:readline'

export default async function* readLines(
  dir: string,
  file: string = 'input.txt',
) {
  yield* await createInterface({
    input: createReadStream(path.join(dir, file)),
  })
}
