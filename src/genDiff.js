import _ from 'lodash'
import parseFileData from './parsers.js'
import { formatDiff } from './formatters/index.js'

const isObject = v => v != null && typeof v === 'object'

const compareObjects = (first = {}, second = {}) => {
  const result = {}
  const keys = _.sortBy(_.union(_.keys(first), _.keys(second)))
  for (const key of keys) {
    const a = first[key]
    const b = second[key]
    const aIsObj = isObject(a)
    const bIsObj = isObject(b)

    if (aIsObj && bIsObj) {
      result[key] = compareObjects(a, b)
      continue
    }

    const aHas = Object.hasOwn(first, key)
    const bHas = Object.hasOwn(second, key)

    if (!aHas && bHas) {
      result[key] = { after: b }
      continue
    }
    if (aHas && !bHas) {
      result[key] = { before: a }
      continue
    }

    if (_.isEqual(a, b)) {
      result[key] = a
    }
    else {
      result[key] = { before: a, after: b }
    }
  }
  return result
}

export default function genDiff(filePath1, filePath2, format = 'stylish') {
  const first = parseFileData(filePath1)
  const second = parseFileData(filePath2)
  const diff = compareObjects(first, second)
  return formatDiff(diff, format)
}
