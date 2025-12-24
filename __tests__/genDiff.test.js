import { expect, test } from '@jest/globals'
import genDiff from '../src/genDiff.js'
import path from 'node:path'
import url from 'node:url'
import * as fs from 'node:fs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fixturesPath = path.resolve(__dirname, '../__fixtures__')

test('should compare two files', () => {
  const actual = genDiff(path.join(fixturesPath, 'file1.json'), path.join(fixturesPath, 'file2.json'))
  const expected = fs.readFileSync(path.join(fixturesPath, 'expected.txt'), 'utf-8')
  expect(actual).toBe(expected)
})
