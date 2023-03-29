import path from 'node:path'
import {readFile, stat, writeFile} from 'node:fs/promises'
import https from 'node:https'

export class Resource {
    storagePath
    outputPath
    etagPath

    constructor({storagePath, outputPath}) {
        this.storagePath = storagePath
        this.outputPath = outputPath
        this.etagPath = path.join(this.storagePath, 'etag')
    }

    titleCase(text) {
        return text
            .toLocaleLowerCase('TR')
            .split(' ')
            .map(word => word.charAt(0).toLocaleUpperCase('TR') + word.slice(1))
            .join(' ')
    }

    async isExistingDataFresh({endpoint, defaultRequestOptions}) {
        const mostRecentEtag = await this.findMostRecentEtag()

        return new Promise((resolve, reject) => {
            const options = Object.assign({}, defaultRequestOptions, {
                method: 'HEAD'
            })

            https
                .request(endpoint, options, async (res) => {
                    const etag = (res.headers['etag'] || '').replace(/"+/g, '')

                    if (etag === mostRecentEtag) {
                        return resolve(true)
                    }

                    await writeFile(this.etagPath, etag)

                    return resolve(false)
                })
                .on('error', (error) => reject(error))
                .end()
        })
    }

    async findMostRecentEtag() {
        try {
            const stats = await stat(this.etagPath)
            if (stats.isFile()) {
                return await readFile(this.etagPath, {encoding: 'utf8'})
            }
        }
        catch (e) {
            return ''
        }

        return ''
    }
}