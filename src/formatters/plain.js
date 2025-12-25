export const formatPlain = (diff) => {
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
