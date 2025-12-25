import _ from 'lodash'
import parseFileData from './parsers.js'

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

const formatDiff = (diff, format) => {
  if (format === 'stylish') {
    return formatStylish(diff)
  }
  else if (format === 'plain') {
    return formatPlain(diff)
  }
}

const formatStylish = (diff, level = 1) => {
  const tab = '  '.repeat(level)
  let result = `{`

  const renderValue = (val, lvl) => {
    if (val == null || typeof val !== 'object') return val
    const innerTab = '  '.repeat(lvl)
    let res = `{\n`
    for (const k of Object.keys(val)) {
      res += `${innerTab}  ${k}: ${renderValue(val[k], lvl + 2)}\n`
    }
    res += `${'  '.repeat(lvl - 1)}}`
    return res
  }

  for (const key of Object.keys(diff)) {
    const value = diff[key]
    const hasOldValue = Object.hasOwn(value, 'before') && diff[key].before !== undefined
    const hasNewValue = Object.hasOwn(value, 'after') && diff[key].after !== undefined

    if (typeof value === 'object' && !hasOldValue && !hasNewValue) {
      result += `\n${tab}  ${key}: ${formatStylish(value, level + 2)}`
    }
    else if (hasOldValue && hasNewValue) {
      const beforeVal = renderValue(value.before, level + 2)
      const afterVal = renderValue(value.after, level + 2)
      result += `\n${tab}- ${key}: ${beforeVal}`
      result += `\n${tab}+ ${key}: ${afterVal}`
    }
    else if (hasOldValue) {
      const beforeVal = renderValue(value.before, level + 2)
      result += `\n${tab}- ${key}: ${beforeVal}`
    }
    else if (hasNewValue) {
      const afterVal = renderValue(value.after, level + 2)
      result += `\n${tab}+ ${key}: ${afterVal}`
    }
    else {
      const plain = renderValue(value, level + 2)
      result += `\n${tab}  ${key}: ${plain}`
    }
  }
  return result + `\n${'  '.repeat(level - 1)}}`
}

const formatPlain = (diff) => {
  const lines = []

  const renderValue = (val) => {
    if (val == null) return 'null'
    if (typeof val === 'object') return '[complex value]'
    if (typeof val === 'string') return `'${val}'`
    return val
  }

  const iter = (currentDiff, path) => {
    for (const key of Object.keys(currentDiff)) {
      const value = currentDiff[key]
      const propertyPath = path ? `${path}.${key}` : key
      const hasOldValue = Object.hasOwn(value, 'before') && value.before !== undefined
      const hasNewValue = Object.hasOwn(value, 'after') && value.after !== undefined

      if (typeof value === 'object' && !hasOldValue && !hasNewValue) {
        iter(value, propertyPath)
      }
      else if (hasOldValue && hasNewValue) {
        const beforeVal = renderValue(value.before)
        const afterVal = renderValue(value.after)
        lines.push(`Property '${propertyPath}' was updated. From ${beforeVal} to ${afterVal}`)
      }
      else if (hasOldValue) {
        const beforeVal = renderValue(value.before)
        lines.push(`Property '${propertyPath}' was removed`)
      }
      else if (hasNewValue) {
        const afterVal = renderValue(value.after)
        lines.push(`Property '${propertyPath}' was added with value: ${afterVal}`)
      }
    }
  }

  iter(diff, '')
  return lines.join('\n')
}

export default function genDiff(filePath1, filePath2, format = 'stylish') {
  const first = parseFileData(filePath1)
  const second = parseFileData(filePath2)
  const diff = compareObjects(first, second)
  return formatDiff(diff, format)
}
