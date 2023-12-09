import {join} from 'path'
import {createServer} from 'vite'
import {ViteNodeRunner} from 'vite-node/client'
import {ViteNodeServer} from 'vite-node/server'
import {expect, test} from 'vitest'
import type * as IOModule from '#lib/io.js'

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

const testRunner = (() => {
  async function init() {
    const server = await createServer({optimizeDeps: {disabled: true}})
    const node = new ViteNodeServer(server)
    const runner = new ViteNodeRunner({
      root: server.config.root,
      fetchModule(id) {
        return node.fetchModule(id)
      },
    })
    const executeFile = runner.executeFile.bind(runner)

    const runnerIo = (await runner.executeFile(
      './src/lib/io.ts',
    )) as typeof IOModule
    const io = runnerIo.default

    return {executeFile, io}
  }
  let cache: ReturnType<typeof init>
  return function testRunner() {
    return (cache ??= init())
  }
})()

export function testDay(
  dayDirname: string,
  parts: {
    part: string | number
    input: string
    expect: string | number | bigint
  }[],
) {
  const partCounts = new Map<string, number>()
  test.each(
    parts.map(({part, input, expect}) => {
      part = String(part)
      const partIdx = partCounts.get(part) ?? 0
      partCounts.set(part, partIdx + 1)
      const specName = part + (partIdx ? ` (#${partIdx + 1})` : '')
      return [specName, part, partIdx, input, expect] as const
    }),
  )(
    'Part %s',
    async (_, part, partIdx, input, want) => {
      const runner = await testRunner()
      const ioOut = runner.io.mock(input)

      // Note: By default, vite-note does not import or execute the same file
      // more than once. However, sometimes we want to test the same day+part
      // multiple times with different inputs/outputs. Therefore, we append
      // an arbitrary file parameter (unique per day+part) to treat this as a
      // new file import.
      await runner.executeFile(join(dayDirname, `${part}.ts?idx=${partIdx}`))

      expect(ioOut.out).toEqual(String(want))
    },
    {sequential: true},
  )
}
