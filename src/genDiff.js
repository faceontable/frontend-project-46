import _ from 'lodash'
import parseFileData from './parsers.js'

export default function genDiff(filePath1, filePath2) {
  const first = parseFileData(filePath1)
  const second = parseFileData(filePath2)
  const keys = _.sortBy(_.union(_.keys(first), _.keys(second)))

  let result = '{'
  for (let key of keys) {
    const firstHasKey = Object.hasOwn(first, key)
    const firstVal = first[key]
    const secondHasKey = Object.hasOwn(second, key)
    const secondVal = second[key]

    if (firstHasKey && secondHasKey) {
      if (firstVal == secondVal) {
        result += `\n    ${key}: ${secondVal}`
      }
      else {
        result += `\n  - ${key}: ${firstVal}`
        result += `\n  + ${key}: ${secondVal}`
      }
    }
    else if (firstHasKey) {
      result += `\n  - ${key}: ${firstVal}`
    }
    else {
      result += `\n  + ${key}: ${secondVal}`
    }
  }
  result += '\n}'
  return result
}
