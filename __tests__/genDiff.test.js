import { expect, test } from '@jest/globals'
import genDiff from '../src/genDiff.js'
import path from 'node:path'
import url from 'node:url'
import * as fs from 'node:fs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fixturesPath = path.resolve(__dirname, '../__fixtures__')

test('should compare JSON files', () => {
  const actual = genDiff(path.join(fixturesPath, 'json/flat', 'file1.json'), path.join(fixturesPath, 'json/flat', 'file2.json'))
  const expected = fs.readFileSync(path.join(fixturesPath, 'json/flat', 'expected.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare YAML files', () => {
  const actual = genDiff(path.join(fixturesPath, 'yaml/flat', 'file1.yaml'), path.join(fixturesPath, 'yaml/flat', 'file2.yaml'))
  const expected = fs.readFileSync(path.join(fixturesPath, 'yaml/flat', 'expected.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare nested JSON structures', () => {
  const actual = genDiff(path.join(fixturesPath, 'json/nested', 'file1.json'), path.join(fixturesPath, 'json/nested', 'file2.json'))
  const expected = fs.readFileSync(path.join(fixturesPath, 'json/nested', 'expected.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare nested YAML structures', () => {
  const actual = genDiff(path.join(fixturesPath, 'yaml/nested', 'file1.yaml'), path.join(fixturesPath, 'yaml/nested', 'file2.yaml'))
  const expected = fs.readFileSync(path.join(fixturesPath, 'yaml/nested', 'expected.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare nested JSON structures in plain format', () => {
  const actual = genDiff(path.join(fixturesPath, 'json/nested', 'file1.json'), path.join(fixturesPath, 'json/nested', 'file2.json'), 'plain')
  const expected = fs.readFileSync(path.join(fixturesPath, 'json/nested', 'expected_plain.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare nested YAML structures in plain format', () => {
  const actual = genDiff(path.join(fixturesPath, 'yaml/nested', 'file1.yaml'), path.join(fixturesPath, 'yaml/nested', 'file2.yaml'), 'plain')
  const expected = fs.readFileSync(path.join(fixturesPath, 'yaml/nested', 'expected_plain.txt'), 'utf-8')
  expect(actual).toBe(expected)
})

test('should compare nested JSON structures in JSON format', () => {
  const actual = genDiff(path.join(fixturesPath, 'json/nested', 'file1.json'), path.join(fixturesPath, 'json/nested', 'file2.json'), 'json')
  const expected = fs.readFileSync(path.join(fixturesPath, 'json/nested', 'expected_json.txt'), 'utf-8')
  expect(actual).toBe(expected)
})
