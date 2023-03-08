import crypto from 'node:crypto'
import path from 'node:path'
import {open, writeFile} from 'node:fs/promises'
import fs from 'node:fs'
import https from 'node:https'
import * as XLSX from 'xlsx'
import {Resource} from '#src/modules/resource'

export class TurkeyCityDistances extends Resource {
    id = 'distances'
    endpoint = 'https://www.kgm.gov.tr/SiteCollectionDocuments/KGMdocuments/Root/Uzakliklar/ilmesafe.xlsx'
    defaultRequestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0',
            'Referer': 'https://www.kgm.gov.tr/',
            'Host': 'www.kgm.gov.tr'
        },
        insecureHTTPParser: true,
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
    }

    constructor({storagePath, outputPath}: {storagePath: string, outputPath: string}) {
        super({storagePath, outputPath})
    }

    async run() {
        // check if we already have the latest data with etag header
        if (! await this.isExistingDataFresh({endpoint: this.endpoint, defaultRequestOptions: this.defaultRequestOptions})) {
            const xlsxpath = await this.refreshData()
            await this.output(xlsxpath)
        }
        else {
            console.log('You have the latest version of the distances.')
        }

        return
    }

    async output(xlsxpath: string) {
        XLSX.set_fs(fs)

        const workbook = XLSX.readFile(xlsxpath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0] || '']
        const json: {[index: string]: string | number}[] = typeof worksheet !== 'undefined' ? XLSX.utils.sheet_to_json(worksheet) : []
        const formatted = this.formatOutput(json)

        await writeFile(path.join(this.outputPath, this.id + '.json'), JSON.stringify(formatted, null, 4))
        await writeFile(path.join(this.outputPath, this.id + '.ts'), `import type {Distances} from 'turkey-neighbourhoods'\n\nexport const distances: Distances = ` + JSON.stringify(formatted, null, 4))

        return formatted
    }

    formatOutput(json: {[index: string]: string | number}[]) {
        json.shift()

        return json.reduce((memo: {[index: string]: object}, obj: {[index: string]: string | number}) => {
            const code: string = Object.values(obj)[0] as string
            memo[code] = Object.keys(obj).reduce((memo2: {[index: string]: number}, str: string) => {
                if (str.includes('__EMPTY_')) {
                    const code2 = str.replace('__EMPTY_', '')
                    const n = obj[str] as number
                    memo2[code2.length === 1 ? '0' + code2 : code2] = n
                }
                return memo2
            }, {})
            return memo
        }, {})
    }

    async refreshData(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const fpath = path.join(this.storagePath, this.id + '.xlsx')
            const fd = await open(fpath, 'w')
            const stream = fd.createWriteStream()

            stream.on('error', (err) => reject(err))
            stream.on('finish', async () => {
                return resolve(fpath)
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
}