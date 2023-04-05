import type {CityCode, CityName, City, CityListItem, CityCodeDistrictMap, CityCodeDistrictNeighbourhoodsMap,
    DistanceChild, PostalCode} from 'turkey-neighbourhoods'
import {distances} from './data/distances/distances.js'
import {codes as cityCodes} from './data/city/codes.js'
import {names as cityNames} from './data/city/names.js'
import {list as cityList} from './data/city/list.js'
import {postalCodes} from './data/postalCode/list.js'
import {mapCodeDistricts} from './data/city/mapCodeDistricts.js'
import {mapCodeDistrictNeighbourhoods} from './data/city/mapCodeDistrictNeighbourhoods.js'

export const isObject = (v: unknown): v is object => {
    return (!!v) && (v.constructor === Object)
}

export const isArray = (v: unknown): v is any[] => {
    return (!!v) && (v.constructor === Array)
}

const titleCase = (text: string): string => {
    return text
        .toLocaleLowerCase('TR')
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase('TR') + word.slice(1))
        .join(' ')
}

export const isCityCode = (v: unknown): v is CityCode => {
    return typeof v === 'string' && cityCodes.find((code) => code === v) !== undefined
}

export const isCityCodeLike = (v: unknown): boolean => {
    if (typeof v === 'string') return isCityCode(v)
    if (typeof v === 'number') return (v < 10 && v > 0) || (v < 82 && v > 0)
    return false
}

export const castCityCode = (v: unknown): CityCode | '' => {
    if (typeof v === 'number' && ((v < 10 && v > 0) || (v < 82 && v > 0))) {
        return (v < 10 ? '0' + v.toString() : v.toString()) as CityCode
    }

    if (typeof v === 'string') {
        const result = v.match(/[0-9]{2}/)
        if (isArray(result) && isCityCode(result[0])) {
            return result[0]
        }
    }

    if (isCityCode(v)) {
        return v
    }

    return ''
}

export const isCityName = (v: unknown): v is CityName => {
    return typeof v === 'string' && cityNames.find((name) => name === v) !== undefined
}

export const isCityNameLike = (v: unknown): boolean => {
    return typeof v === 'string' && isCityName(titleCase(v))
}

export const castCityName = (v: unknown): CityName | '' => {
    return typeof v === 'string' && isCityNameLike(v) ? titleCase(v) as CityName : ''
}

export const isCity = (v: unknown): v is City => {
    return typeof v === 'string' && (isCityCode(v) || isCityName(v))
}

export const findDistance = (code1: CityCode, code2: CityCode): number | undefined => {
    if (isCityCode(code1) && isCityCode(code2)) {
        if (Object.hasOwn(distances, code1)) {
            if (Object.hasOwn(distances[code1], code2)) {
                return distances[code1][code2]
            }
        }
    }
    return undefined
}

export const findClosestCities = (code: CityCode, threshold = 9999, limit = 100): {code: CityCode, distance: number}[] => {
    if (!Object.hasOwn(distances, code)) {
        return []
    }

    const obj = distances[code] as DistanceChild

    return Object
        .keys(obj)
        .sort((a: string, b: string) => {
            return (obj[a as keyof DistanceChild] as number) < (obj[b as keyof DistanceChild] as number)
                ? -1
                : (obj[a as keyof DistanceChild] as number) > (obj[b as keyof DistanceChild] as number)
                    ? 1
                    : 0
        })
        .map((code2: string) => {
            return {code: code2 as CityCode, distance: (obj[code2 as keyof DistanceChild] as number)}
        })
        .filter((obj, i) => obj.distance <= threshold && i+1 <= limit)
}

export const getCityNames = (): CityName[] => {
    return Array.from(cityNames)
}

export const getCityCodes = (): CityCode[] => {
    return Array.from(cityCodes)
}

export const getCities = (): CityListItem[] => {
    return cityList
}

export const getPostalCodes = (): PostalCode[] => {
    return Array.from(postalCodes)
}

export const isPostalCode = (v: unknown): v is PostalCode => {
    return typeof v === 'string' && postalCodes.find((code) => code === v) !== undefined
}

export const getDistrictsByCityCode = (code: CityCode): string[] => {
    return mapCodeDistricts[code] || []
}

export const getDistrictsOfEachCity = (): CityCodeDistrictMap => {
    return mapCodeDistricts
}

export const getDistrictsAndNeighbourhoodsByCityCode = (code: CityCode): {[index: string]: string[]} => {
    return mapCodeDistrictNeighbourhoods[code] || {}
}

export const getDistrictsAndNeighbourhoodsOfEachCity = (): CityCodeDistrictNeighbourhoodsMap => {
    return mapCodeDistrictNeighbourhoods
}

export const getNeighbourhoodsByCityCodeAndDistrict = (code: CityCode, district: string): string[] => {
    return (mapCodeDistrictNeighbourhoods[code] || {})[district] || []
}