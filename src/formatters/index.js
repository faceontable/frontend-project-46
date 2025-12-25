import { formatStylish } from './stylish.js'
import { formatPlain } from './plain.js'

export const formatDiff = (diff, format) => {
  if (format === 'stylish') {
    return formatStylish(diff)
  }
  else if (format === 'plain') {
    return formatPlain(diff)
  }
  else if (format === 'json') {
    return JSON.stringify(diff)
  }
}
