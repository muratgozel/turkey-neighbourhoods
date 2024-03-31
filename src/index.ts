import { default as _distances } from './data/distances.json'
import { default as _cityList } from './data/cityList.json'
import { default as _cityCodes } from './data/cityCodes.json'
import { default as _cityNames } from './data/cityNames.json'
import { default as _cityNamesByCode } from './data/cityNamesByCode.json'
import { default as _postalCodes } from './data/postalCodes.json'
import { default as _districtsByCityCode } from './data/districtsByCityCode.json'
import { default as _neighbourhoodsByDistrictAndCityCode } from './data/neighbourhoodsByDistrictAndCityCode.json'

export const distances = _distances
export const cityList = _cityList
export const cityCodes = _cityCodes
export const cityNames = _cityNames
export const cityNamesByCode = _cityNamesByCode
export const postalCodes = _postalCodes
export const districtsByCityCode = _districtsByCityCode
export const neighbourhoodsByDistrictAndCityCode = _neighbourhoodsByDistrictAndCityCode

export function isCityCode (v: unknown): boolean {
    return typeof v === 'string' && cityCodes.find((code) => code === v) !== undefined
}

export function isCityName (v: unknown): boolean {
    return typeof v === 'string' && cityNames.find((name) => name === v) !== undefined
}

export function findDistance (code1: string, code2: string): number | undefined {
    if (isCityCode(code1) && isCityCode(code2)) {
        if (code1 in distances) {
            if (code2 in distances[code1 as keyof typeof distances]) {
                // @ts-ignore
                return distances[code1 as keyof typeof distances][code2]
            }
        }
    }
    return undefined
}

export function findClosestCities (code: string, threshold = 9999, limit = 100): {code: string, distance: number}[] {
    if (!Object.hasOwn(distances, code)) {
        return []
    }

    const obj = distances[code as keyof typeof distances]

    return Object
        .keys(obj)
        .sort((a: string, b: string) => {
            return obj[a as keyof typeof obj] < obj[b as keyof typeof obj]
                ? -1
                : obj[a as keyof typeof obj] > obj[b as keyof typeof obj]
                    ? 1
                    : 0
        })
        .map((code2: string) => {
            return { code: code2, distance: obj[code2 as keyof typeof obj] }
        })
        // exclude itself
        .filter((obj) => {
            return obj.distance > 0
        })
        .filter((obj, i) => {
            return obj.distance <= threshold && i+1 <= limit
        })
}

export function getCityNames () {
    return Array.from(cityNames)
}

export function getCityCodes () {
    return Array.from(cityCodes)
}

export function getCities () {
    return cityList
}

export function getPostalCodes () {
    return Array.from(postalCodes)
}

export function isPostalCode (v: unknown): boolean {
    return typeof v === 'string' && postalCodes.find((code) => code === v) !== undefined
}

export function getDistrictsByCityCode (code: string) {
    return districtsByCityCode[code as keyof typeof districtsByCityCode] ?? []
}

export function getDistrictsOfEachCity () {
    return districtsByCityCode
}

export function getDistrictsAndNeighbourhoodsByCityCode (code: string) {
    return neighbourhoodsByDistrictAndCityCode[code as keyof typeof neighbourhoodsByDistrictAndCityCode] || {}
}

export function getDistrictsAndNeighbourhoodsOfEachCity () {
    return neighbourhoodsByDistrictAndCityCode
}

export function getNeighbourhoodsByCityCodeAndDistrict (code: string, district: string): string[] {
    // @ts-ignore
    return neighbourhoodsByDistrictAndCityCode[code as keyof typeof neighbourhoodsByDistrictAndCityCode][district] ?? []
}
