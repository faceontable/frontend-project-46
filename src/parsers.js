import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import YAML from 'js-yaml'
import _ from 'lodash'

export default function parseFileData(pathToFile) {
  const resolvedPath = path.resolve(process.cwd(), pathToFile)
  const content = fs.readFileSync(resolvedPath, 'utf-8')
  if (_.endsWith(resolvedPath, '.yaml') || _.endsWith(resolvedPath, '.yml')) {
    return YAML.load(content)
  }
  else if (_.endsWith(resolvedPath, '.json')) {
    return JSON.parse(content)
  }
}
