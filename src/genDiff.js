import _ from 'lodash'
import parseFileData from './parsers.js'

const compareObjects = (first, second, level = 1) => {
  const keys = _.sortBy(_.union(_.keys(first), _.keys(second)))
  const tab = '  '.repeat(level)
  let result = `{`

  const formatValue = (val, lvl) => {
    return val != null && typeof val === 'object' ? compareObjects(val, val, lvl) : val
  }

  for (let key of keys) {
    const firstHasKey = Object.hasOwn(first, key)
    const firstVal = first[key]
    const secondHasKey = Object.hasOwn(second, key)
    const secondVal = second[key]

    if (firstHasKey && secondHasKey) {
      if (firstVal != null && typeof firstVal === 'object' && secondVal != null && typeof secondVal === 'object') {
        result += `\n${tab}  ${key}: ${compareObjects(firstVal, secondVal, level + 2)}`
      }
      else if (firstVal != null && typeof firstVal === 'object') {
        result += `\n${tab}- ${key}: ${formatValue(firstVal, level + 2)}`
        result += `\n${tab}+ ${key}: ${secondVal}`
      }
      else if (secondVal != null && typeof secondVal === 'object') {
        result += `\n${tab}- ${key}: ${firstVal}`
        result += `\n${tab}+ ${key}: ${formatValue(secondVal, level + 2)}`
      }
      else {
        if (firstVal == secondVal) {
          result += `\n${tab}  ${key}: ${secondVal}`
        }
        else {
          result += `\n${tab}- ${key}: ${firstVal}`
          result += `\n${tab}+ ${key}: ${secondVal}`
        }
      }
    }
    else if (firstHasKey) {
      result += `\n${tab}- ${key}: ${formatValue(firstVal, level + 2)}`
    }
    else {
      result += `\n${tab}+ ${key}: ${formatValue(secondVal, level + 2)}`
    }
  }
  return result + `\n${'  '.repeat(level - 1)}}`
}

export default function genDiff(filePath1, filePath2) {
  const first = parseFileData(filePath1)
  const second = parseFileData(filePath2)
  return compareObjects(first, second)
}
