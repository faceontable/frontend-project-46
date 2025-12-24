import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import _ from 'lodash';

function readFileData(pathToFile) {
    const resolvedPath = path.resolve(process.cwd(), pathToFile)
    return JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))
}

export default function genDiff(filePath1, filePath2) {
    const first = readFileData(filePath1);
    const second = readFileData(filePath2);
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
            } else {
                result += `\n  - ${key}: ${firstVal}`
                result += `\n  + ${key}: ${secondVal}`
            }
        } else if (firstHasKey) {
            result += `\n  - ${key}: ${firstVal}`
        } else {
            result += `\n  + ${key}: ${secondVal}`
        }
    }
    result += '\n}'
    return result
}