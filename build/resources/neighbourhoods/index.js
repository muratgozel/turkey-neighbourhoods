import * as crypto from 'node:crypto';
import * as https from 'node:https';
import * as fs from 'node:fs';
import { writeFile, open, readFile } from 'node:fs/promises';
import path from 'node:path';
import StreamZip from 'node-stream-zip';
import * as XLSX from 'xlsx';
import getSlug from 'speakingurl';
import { Resource } from '#src/modules/resource';
export class TurkeyNeighbourhoods extends Resource {
    id = 'neighbourhoods';
    endpoint = 'https://postakodu.ptt.gov.tr/Dosyalar/pk_list.zip';
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
    };
    constructor({ storagePath, outputPath }) {
        super({ storagePath, outputPath });
    }
    async run() {
        // check if we already have the latest data with etag header
        if (!await this.isExistingDataFresh({ endpoint: this.endpoint, defaultRequestOptions: this.defaultRequestOptions })) {
            const xlsxpath = await this.refreshData();
            await this.output(xlsxpath);
        }
        else {
            console.log('You have the latest version of the neighbourhoods.');
        }
        await this.dist();
        return;
    }
    async dist() {
        const rawpath = path.join(this.outputPath, this.id + '.json');
        const raw = JSON.parse(await readFile(rawpath, { encoding: 'utf8' }));
        const distPath = path.join('src', 'data');
        const cityNames = [...new Set(raw.map((arr) => arr[1]))];
        await writeFile(path.join(distPath, 'city', 'names.json'), JSON.stringify(cityNames, null, 4));
        await writeFile(path.join(distPath, 'city', 'names.ts'), `import type {CityName} from 'turkey-neighbourhoods'\n\nexport const names: CityName[] = ` + JSON.stringify(cityNames, null, 4));
        const cityCodes = [...new Set(raw.map((arr) => arr[0]))];
        await writeFile(path.join(distPath, 'city', 'codes.json'), JSON.stringify(cityCodes, null, 4));
        await writeFile(path.join(distPath, 'city', 'codes.ts'), `import type {CityCode} from 'turkey-neighbourhoods'\n\nexport const codes: CityCode[] = ` + JSON.stringify(cityCodes, null, 4));
        const cityList = raw.reduce((memo, arr) => {
            if (!memo.some(item => item.code === arr[0])) {
                memo = memo.concat({ code: arr[0], name: arr[1] });
            }
            return memo;
        }, []);
        await writeFile(path.join(distPath, 'city', 'list.json'), JSON.stringify(cityList, null, 4));
        await writeFile(path.join(distPath, 'city', 'list.ts'), `import type {CityListItem} from 'turkey-neighbourhoods'\n\nexport const list: CityListItem[] = ` + JSON.stringify(cityList, null, 4));
        const cityMapCodeName = cityList.reduce((memo, obj) => {
            if (typeof obj.code === 'string')
                memo[obj.code] = obj.name;
            return memo;
        }, {});
        await writeFile(path.join(distPath, 'city', 'mapCodeName.json'), JSON.stringify(cityMapCodeName, null, 4));
        await writeFile(path.join(distPath, 'city', 'mapCodeName.ts'), `import type {CityCodeNameMap} from 'turkey-neighbourhoods'\n\nexport const mapCodeName: CityCodeNameMap = ` + JSON.stringify(cityMapCodeName, null, 4));
        const cityMapCodeDistricts = raw.reduce((memo, arr) => {
            if (typeof arr[0] === 'string' && typeof arr[2] === 'string') {
                if (!Array.isArray(memo[arr[0]]))
                    memo[arr[0]] = [];
                if (!(memo[arr[0]] || []).includes(arr[2])) {
                    memo[arr[0]] = (memo[arr[0]] || []).concat(arr[2]);
                }
            }
            return memo;
        }, {});
        await writeFile(path.join(distPath, 'city', 'mapCodeDistricts.json'), JSON.stringify(cityMapCodeDistricts, null, 4));
        await writeFile(path.join(distPath, 'city', 'mapCodeDistricts.ts'), `import type {CityCodeDistrictMap} from 'turkey-neighbourhoods'\n\nexport const mapCodeDistricts: CityCodeDistrictMap = ` + JSON.stringify(cityMapCodeDistricts, null, 4));
        const postalCodes = raw.map((arr) => arr[4]);
        await writeFile(path.join(distPath, 'postalCode', 'list.json'), JSON.stringify(postalCodes, null, 4));
        await writeFile(path.join(distPath, 'postalCode', 'list.ts'), `import type {PostalCode} from 'turkey-neighbourhoods'\n\nexport const postalCodes: PostalCode[] = ` + JSON.stringify(postalCodes, null, 4));
        const mapCodeDistrictNeighbourhoods = raw.reduce((memo, arr) => {
            if (typeof arr[0] === 'string' && typeof arr[2] === 'string') {
                if (!memo[arr[0]])
                    memo[arr[0]] = {};
                if (!(memo[arr[0]] || {})[arr[2]])
                    (memo[arr[0]] || {})[arr[2]] = [];
                if (typeof arr[0] === 'string' && typeof arr[2] === 'string' && typeof arr[3] === 'string') {
                    if (!((memo[arr[0]] || {})[arr[2]] || []).includes(arr[3])) {
                        (memo[arr[0]] || {})[arr[2]] = ((memo[arr[0]] || {})[arr[2]] || []).concat(arr[3]);
                    }
                }
            }
            return memo;
        }, {});
        await writeFile(path.join(distPath, 'city', 'mapCodeDistrictNeighbourhoods.json'), JSON.stringify(mapCodeDistrictNeighbourhoods, null, 4));
        await writeFile(path.join(distPath, 'city', 'mapCodeDistrictNeighbourhoods.ts'), `import type {CityCodeDistrictNeighbourhoodsMap} from 'turkey-neighbourhoods'\n\nexport const mapCodeDistrictNeighbourhoods: CityCodeDistrictNeighbourhoodsMap = ` + JSON.stringify(mapCodeDistrictNeighbourhoods, null, 4));
        const jobs = Object.keys(mapCodeDistrictNeighbourhoods).map(async (code) => {
            const name = getSlug(cityMapCodeName[code].toLocaleLowerCase('TR'), { lang: 'tr', maintainCase: true });
            await writeFile(path.join(distPath, 'city', name + '.json'), JSON.stringify(mapCodeDistrictNeighbourhoods[code], null, 4));
            await writeFile(path.join(distPath, 'city', name + '.ts'), 'export const ' + name + ' = ' + JSON.stringify(mapCodeDistrictNeighbourhoods[code], null, 4));
        });
        await Promise.all(jobs);
    }
    async output(xlsxpath) {
        XLSX.set_fs(fs);
        const workbook = XLSX.readFile(xlsxpath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0] || ''];
        const json = typeof worksheet !== 'undefined' ? XLSX.utils.sheet_to_json(worksheet) : [];
        const formatted = this.formatOutput(json);
        await writeFile(path.join(this.outputPath, this.id + '.json'), JSON.stringify(formatted, null, 4));
        await writeFile(path.join(this.outputPath, this.id + '.ts'), `import type {NeighbourhoodList} from 'turkey-neighbourhoods'\n\nexport const neighbourhoods: NeighbourhoodList = ` + JSON.stringify(formatted, null, 4));
        return formatted;
    }
    formatOutput(json) {
        return json.map(obj => {
            return [
                obj['PK'].slice(0, 2),
                this.titleCase(obj['il'].trim()),
                this.titleCase(obj['ilçe'].trim()),
                this.titleCase(obj['Mahalle'].trim()),
                obj['PK']
            ];
        });
    }
    async refreshData() {
        return new Promise(async (resolve, reject) => {
            const fpath = path.join(this.storagePath, this.id + '.zip');
            const fd = await open(fpath, 'w');
            const stream = fd.createWriteStream();
            stream.on('error', (err) => reject(err));
            stream.on('finish', async () => {
                const zip = new StreamZip.async({ file: fpath, storeEntries: true });
                for (const entry of Object.values(await zip.entries())) {
                    if (path.extname(entry.name) !== '.xlsx')
                        continue;
                    const outpath = path.join(this.storagePath, entry.name);
                    await zip.extract(entry, outpath);
                    await zip.close();
                    return resolve(outpath);
                }
                return reject(new Error('XLSX file not found.'));
            });
            https
                .request(this.endpoint, this.defaultRequestOptions, async (res) => {
                res.pipe(stream);
                res.on('error', (err) => {
                    stream.close();
                    return reject(err);
                });
            })
                .on('error', (error) => reject(error))
                .end();
        });
    }
}
