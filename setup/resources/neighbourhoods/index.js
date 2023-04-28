import * as crypto from 'node:crypto'
import * as https from 'node:https'
import * as fs from 'node:fs'
import {writeFile, open, readFile} from 'node:fs/promises'
import path from 'node:path'
import StreamZip from 'node-stream-zip'
import * as XLSX from 'xlsx'
import getSlug from 'speakingurl'
import {Resource} from '../../modules/resource.js'

export class TurkeyNeighbourhoods extends Resource {
    id = 'neighbourhoods'
    endpoint = 'https://postakodu.ptt.gov.tr/Dosyalar/pk_list.zip'
    defaultRequestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0',
            'Referer': 'http://postakodu.ptt.gov.tr/',
            'Host': 'postakodu.ptt.gov.tr'
        },
        insecureHTTPParser: true,
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
    }

    constructor({storagePath, outputPath}) {
        super({storagePath, outputPath})
    }

    async run() {
        let xlsxpath = ''
        // check if we already have the latest data with etag header
        if (! await this.isExistingDataFresh({endpoint: this.endpoint, defaultRequestOptions: this.defaultRequestOptions})) {
            xlsxpath = await this.refreshData()
        }
        else {
            xlsxpath = await this.extractZip(path.join(this.storagePath, this.id + '.zip'))
            console.log('You have the latest version of the neighbourhoods.')
        }

        const neighbourhoods = await this.output(xlsxpath)
        await this.dist(neighbourhoods)
    }

    async dist(raw) {
        const distPath = path.join('src', 'data')

        const cityNames = [...new Set(raw.map((arr) => arr[1]))]
        const citynamesStr = JSON.stringify(cityNames, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'names.ts'), 'export const names = ' + citynamesStr + ' as const\n\nexport type CityName = typeof names[number]')
        const cityCodes = [...new Set(raw.map((arr) => arr[0]))]
        const cityCodesStr = JSON.stringify(cityCodes, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'codes.ts'), 'export const codes = ' + cityCodesStr + ' as const\n\nexport type CityCode = typeof codes[number]')
        const cityList = raw.reduce((memo, arr) => {
            if (!memo.some(item => item.code === arr[0])) {
                memo = memo.concat({code: arr[0], name: arr[1]})
            }
            return memo
        }, [])
        const cityListStr = JSON.stringify(cityList, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'list.ts'), 'import type {CityName} from \'./names\'\nimport type {CityCode} from \'./codes\'\n\nexport type CityListItem = {\n    code: CityCode,\n    name: CityName\n}\n\nexport const list: CityListItem[] = ' + cityListStr)
        const cityMapCodeName = cityList.reduce((memo, obj) => {
            if (typeof obj.code === 'string') memo[obj.code] = obj.name
            return memo
        }, {})
        const cityMapCodeNameStr = JSON.stringify(cityMapCodeName, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'mapCodeName.ts'), 'import type {CityName} from \'./names\'\nimport type {CityCode} from \'./codes\'\n\nexport type CityCodeNameMap = {\n    [key in CityCode]: CityName\n}\n\nexport const mapCodeName: CityCodeNameMap = ' + cityMapCodeNameStr)
        const cityMapCodeDistricts = raw.reduce((memo, arr) => {
            if (typeof arr[0] === 'string' && typeof arr[2] === 'string') {
                if (!Array.isArray(memo[arr[0]])) memo[arr[0]] = []
                if (!(memo[arr[0]] || []).includes(arr[2])) {
                    memo[arr[0]] = (memo[arr[0]] || []).concat(arr[2])
                }
            }
            return memo
        }, {})
        const cityMapCodeDistrictsStr = JSON.stringify(cityMapCodeDistricts, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'mapCodeDistricts.ts'), 'import type {CityCode} from \'./codes\'\n\nexport type CityCodeDistrictMap = {\n    [key in CityCode]: string[]\n}\n\nexport const mapCodeDistricts: CityCodeDistrictMap = ' + cityMapCodeDistrictsStr)

        const postalCodes = raw.map((arr) => arr[4])
        const postalCodesStr = JSON.stringify(postalCodes, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'postalCode', 'list.ts'), 'export const postalCodes: string[] = ' + postalCodesStr + '\n\n')

        const mapCodeDistrictNeighbourhoods = raw.reduce((memo, arr) => {
            if (typeof arr[0] === 'string' && typeof arr[2] === 'string') {
                if (!memo[arr[0]]) memo[arr[0]] = {}
                if (!(memo[arr[0]] || {})[arr[2]]) (memo[arr[0]] || {})[arr[2]] = []
                if (typeof arr[0] === 'string' && typeof arr[2] === 'string' && typeof arr[3] === 'string') {
                    if (!((memo[arr[0]] || {})[arr[2]] || []).includes(arr[3])) {
                        (memo[arr[0]] || {})[arr[2]] = ((memo[arr[0]] || {})[arr[2]] || []).concat(arr[3].replace('\'', '`'))
                    }
                }
            }
            return memo
        }, {})
        const mapCodeDistrictNeighbourhoodsStr = JSON.stringify(mapCodeDistrictNeighbourhoods, null, 4).replace(/"/g, '\'')
        await writeFile(path.join(distPath, 'city', 'mapCodeDistrictNeighbourhoods.ts'), 'import type {CityCode} from \'./codes\'\n\nexport type CityCodeDistrictNeighbourhoodsMap = {\n    [key in CityCode]: {\n        [index: string]: string[]\n    }\n}\n\nexport const mapCodeDistrictNeighbourhoods: CityCodeDistrictNeighbourhoodsMap = ' + mapCodeDistrictNeighbourhoodsStr)

        const jobs = Object.keys(mapCodeDistrictNeighbourhoods).map(async (code) => {
            const name = getSlug(cityMapCodeName[code].toLocaleLowerCase('TR'), {lang: 'tr', maintainCase: true})
            const data = JSON.stringify(mapCodeDistrictNeighbourhoods[code], null, 4).replace(/"/g, '\'')
            await writeFile(path.join(distPath, 'perCity', name + '.ts'), 'export const ' + name + ': {[index: string]: string[]} = ' + data)
        })
        await Promise.all(jobs)
    }

    async output(xlsxpath) {
        XLSX.set_fs(fs)

        const workbook = XLSX.readFile(xlsxpath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0] || '']
        const json = typeof worksheet !== 'undefined' ? XLSX.utils.sheet_to_json(worksheet) : []
        const formatted = this.formatOutput(json)
        const formattedStr = JSON.stringify(formatted, null, 4).replace(/'/g, '`').replace(/"/g, '\'')

        await writeFile(path.join(this.outputPath, this.id + '.ts'), 'import type { NeighbourhoodList } from \'turkey-neighbourhoods\'\n\nexport const neighbourhoods: NeighbourhoodList = ' + formattedStr)

        return formatted
    }

    formatOutput(json) {
        return json.map(obj => {
            return [
                obj['PK'].slice(0, 2),
                this.titleCase(obj['il'].trim()),
                this.titleCase(obj['ilçe'].trim()),
                this.titleCase(obj['Mahalle'].trim()),
                obj['PK']
            ]
        })
    }

    async refreshData() {
        const fpath = path.join(this.storagePath, this.id + '.zip')
        const fd = await open(fpath, 'w')
        const stream = fd.createWriteStream()

        return new Promise((resolve, reject) => {
            stream.on('error', (err) => reject(err))
            stream.on('finish', async () => {
                const zip = new StreamZip.async({file: fpath, storeEntries: true})

                for (const entry of Object.values(await zip.entries())) {
                    if (path.extname(entry.name) !== '.xlsx') continue

                    const outpath = path.join(this.storagePath, entry.name)
                    await zip.extract(entry, outpath)
                    await zip.close()

                    return resolve(outpath)
                }

                return reject(new Error('XLSX file not found.'))
            })

            https
                .request(this.endpoint, this.defaultRequestOptions, async (res) => {
                    res.pipe(stream)

                    res.on('error', (err) => {
                        stream.close()
                        return reject(err)
                    })
                })
                .on('error', (error) => reject(error))
                .end()
        })
    }

    async extractZip(zipPath) {
        const zip = new StreamZip.async({file: zipPath, storeEntries: true})

        for (const entry of Object.values(await zip.entries())) {
            if (path.extname(entry.name) !== '.xlsx') continue

            const outpath = path.join(this.storagePath, entry.name)
            await zip.extract(entry, outpath)
            await zip.close()

            return outpath
        }

        return null
    }
}