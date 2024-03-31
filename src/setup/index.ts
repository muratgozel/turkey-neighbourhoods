import {writeFile, stat} from 'node:fs/promises'
import prettyBytes from 'pretty-bytes'
import {logger, stringify, isArray} from './utilities'
import {fetchAndParseNeighbourhoods} from './neighbourhoods'
import {fetchDistances} from './distances'

logger.info('Fetching neighbourhoods.')
const neighbourhoods = await fetchAndParseNeighbourhoods('./src/data/neighbourhoods.json')
logger.info(`Found ${neighbourhoods.length} neighbourhoods.`)

logger.info('Generating city data.')
const cityNames = [...new Set(neighbourhoods.map((arr) => arr[1]))]
await writeFile('./src/data/cityNames.json', stringify(cityNames))
logger.info(`- cityNames.json (${prettyBytes((await stat('./src/data/cityNames.json')).size)})`)

const cityCodes = [...new Set(neighbourhoods.map((arr) => arr[0]))]
await writeFile('./src/data/cityCodes.json', stringify(cityCodes))
logger.info(`- cityCodes.json (${prettyBytes((await stat('./src/data/cityCodes.json')).size)})`)

const cityList = neighbourhoods.reduce((memo: City[], arr) => {
    if (!memo.some(item => item.code === arr[0])) {
        memo = memo.concat([{ code: arr[0]!, name: arr[1]! }])
    }
    return memo
}, [])
await writeFile('./src/data/cityList.json', stringify(cityList))
logger.info(`- cityList.json (${prettyBytes((await stat('./src/data/cityList.json')).size)})`)

const cityNamesByCode = cityList.reduce((memo: Record<string, string>, obj) => {
    memo[obj.code] = obj.name
    return memo
}, {})
await writeFile('./src/data/cityNamesByCode.json', stringify(cityNamesByCode))
logger.info(`- cityNamesByCode.json (${prettyBytes((await stat('./src/data/cityNamesByCode.json')).size)})`)

const districtsByCityCode = neighbourhoods.reduce((memo: Record<string, string[]>, arr) => {
    const code = arr[0]!
    const district = arr[2]!

    if (!isArray(memo[code])) memo[code] = []

    if (!memo[code]!.includes(district)) {
        memo[code] = memo[code]!.concat(district)
    }

    return memo
}, {})
await writeFile('./src/data/districtsByCityCode.json', stringify(districtsByCityCode))
logger.info(`- districtsByCityCode.json (${prettyBytes((await stat('./src/data/districtsByCityCode.json')).size)})`)

const postalCodes = [...new Set(neighbourhoods.map((arr) => arr[4]!))]
await writeFile('./src/data/postalCodes.json', stringify(postalCodes))
logger.info(`- postalCodes.json (${prettyBytes((await stat('./src/data/postalCodes.json')).size)})`)

const neighbourhoodsByDistrictAndCityCode = neighbourhoods.reduce((memo: Record<string, Record<string, string[]>>, arr) => {
    const code = arr[0]!
    const district = arr[2]!
    const neighbourhood = arr[3]!

    if (!memo[code]) memo[code] = {}

    if (!memo[code]![district]) memo[code]![district] = []

    memo[code]![district] = memo[code]![district]!.concat(neighbourhood)

    return memo
}, {})
await writeFile('./src/data/neighbourhoodsByDistrictAndCityCode.json', stringify(neighbourhoodsByDistrictAndCityCode))
logger.info(`- neighbourhoodsByDistrictAndCityCode.json (${prettyBytes((await stat('./src/data/neighbourhoodsByDistrictAndCityCode.json')).size)})`)

logger.info('Fetching distances.')
await fetchDistances('./src/data/distances.json')
logger.info(`Distance data is ready. (${prettyBytes((await stat('./src/data/distances.json')).size)})`)

export interface City {
    code: string
    name: string
}
