import {writeFile} from 'node:fs/promises'
import * as fs from 'node:fs'
import * as XLSX from 'xlsx'
import {stringify} from './utilities'

export async function fetchDistances (outputPath: string) {
    const xlsxFilePath = './src/data/distances.xlsx'

    // download xlsx
    const url = process.env.npm_package_config_distances_endpoint
    const res = await fetch(url)
    const blob = await res.blob()
    await writeFile(xlsxFilePath, blob.stream())

    // parse
    XLSX.set_fs(fs)

    const workbook = XLSX.readFile(xlsxFilePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]!]!
    const _distances = XLSX.utils.sheet_to_json(worksheet) as Record<string, string>[]

    _distances.shift()

    const distances = _distances.reduce((memo, obj) => {
        const code = Object.values(obj)[0]!
        // @ts-ignore
        memo[code] = Object.keys(obj).reduce((memo2: Record<string, string>, str) => {
            if (str.includes('__EMPTY_')) {
                const code2 = str.replace('__EMPTY_', '')
                memo2[code2.length === 1 ? '0' + code2 : code2] = obj[str]!
            }
            return memo2
        }, {})
        return memo
    }, {})

    await writeFile(outputPath, stringify(distances))

    return distances
}
