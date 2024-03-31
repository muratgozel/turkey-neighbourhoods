import {writeFile} from 'node:fs/promises'
import path from 'node:path'
import * as fs from 'node:fs'
import StreamZip from 'node-stream-zip'
import * as XLSX from 'xlsx'
import {titleCase, stringify} from './utilities'

export async function fetchAndParseNeighbourhoods (outputPath: string) {
    const zipFilePath = './src/data/neighbourhoods.zip'
    const xlsxFilePath = zipFilePath.replace('.zip', '.xlsx')

    // download zip
    const url = process.env.npm_package_config_neighbourhoods_endpoint
    const res = await fetch(url)
    const blob = await res.blob()
    await writeFile(zipFilePath, blob.stream())

    // extract
    const zip = new StreamZip.async({file: zipFilePath, storeEntries: true})

    for (const entry of Object.values(await zip.entries())) {
        if (!entry.isFile || path.extname(entry.name) !== '.xlsx') continue

        await zip.extract(entry, xlsxFilePath)
        await zip.close()
    }

    // parse
    XLSX.set_fs(fs)

    const workbook = XLSX.readFile(xlsxFilePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]!]!
    const records = (XLSX.utils.sheet_to_json(worksheet) as TurkeyNeighbourhoodsRawNeighbourhoodRecord[])
        .map((record) => {
            const rec = [
                record.PK.slice(0, 2),
                titleCase(record.il.trim()),
                titleCase(record['ilçe'].trim()),
                titleCase(record.Mahalle.trim()),
                record.PK
            ]
            return transform(rec)
        })
    await writeFile(outputPath, stringify(records))

    return records
}

function transform (rec: string[]) {
    /*
    if (rec[0] === '34' && rec[2] === 'Sultangazi' && rec[3] === 'Eski Habipler Mah') {
        rec[3] = 'Eski Habibler Mah'
    }
    */

    return rec
}

interface TurkeyNeighbourhoodsRawNeighbourhoodRecord {
    PK: string
    il: string
    ilçe: string
    Mahalle: string
}
