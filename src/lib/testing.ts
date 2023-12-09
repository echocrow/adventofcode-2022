import {basename} from 'node:path'
import {describe, expect, test} from 'vitest'
import io from '#lib/io.js'

export function dedent(str: string | readonly string[]): string {
  if (typeof str !== 'string') str = str.join('')

  // Trim single trailing newline.
  str = str.replace(/^\n/, '')
  str = str.replace(/\n[\t ]*$/, '')

  // Remove indents based on first line.
  const indents = /^[\t ]+/.exec(str)?.[0].length
  if (indents) {
    const re = new RegExp(`^[\t ]{${indents}}`, 'gm')
    str = str.replaceAll(re, '')
  }

  return str
}

type PartSpec = [input: string, expect: string | number | bigint]

function isPartSpec(spec: PartSpec | PartSpec[]): spec is PartSpec {
  return typeof spec[0] === 'string'
}

async function expectPart(
  filePath: string,
  input: PartSpec[0],
  want: PartSpec[1],
  idx?: number,
) {
  const ioOut = io.mock(input)

  // Note: By default, vite-note does not import or execute the same file
  // more than once. However, sometimes we want to test the same day+part
  // multiple times with different inputs/outputs. Therefore, we append
  // an arbitrary file parameter (unique per day+part) to treat this as a
  // new file import.
  if (idx !== undefined) filePath += `?idx=${idx}`
  await import(filePath)

  expect(ioOut.out).toEqual(String(want))
}

/**
 * Test an AoC day part with a pair (or pairs of) input and desired output.
 */
export async function testPart(
  partPath$: string | Promise<{default: string}>,
  spec: PartSpec | PartSpec[],
) {
  const partPath =
    typeof partPath$ === 'string' ? partPath$ : (await partPath$).default
  const testName = `Part ${basename(partPath, '.ts')}`
  if (isPartSpec(spec)) {
    test(testName, async () => {
      await expectPart(partPath, ...spec)
    })
  } else {
    describe(testName, async () => {
      test.each(spec.map(([input, expect], i) => [i + 1, input, expect]))(
        '#%d',
        async (idx, input, want) => {
          await expectPart(partPath, input, want, idx)
        },
        {sequential: true},
      )
    })
  }
}
