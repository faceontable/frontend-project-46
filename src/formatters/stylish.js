export const formatStylish = (diff, level = 1) => {
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
