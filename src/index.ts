import type {CityCode, CityName, City, CityListItem, DistanceChild, PostalCode} from 'turkey-neighbourhoods'
import {distances} from '#src/data/distances/distances'
import {codes as cityCodes} from '#src/data/city/codes'
import {names as cityNames} from '#src/data/city/names'
import {list as cityList} from '#src/data/city/list'
import {postalCodes} from '#src/data/postalCode/list'
import {mapCodeDistricts as cityCodeDistrictsMap} from '#src/data/city/mapCodeDistricts'
import {mapCodeDistrictNeighbourhoods as cityCodeDistrictNeighbourhoodsMap} from '#src/data/city/mapCodeDistrictNeighbourhoods'

const hasProp1 = <Obj, Prop extends string>(obj: Obj, prop: Prop): obj is Obj & Record<Prop, DistanceChild> =>
    Object.prototype.hasOwnProperty.call(obj, prop)
const hasProp2 = <Obj, Prop extends string>(obj: Obj, prop: Prop): obj is Obj & Record<Prop, number> =>
    Object.prototype.hasOwnProperty.call(obj, prop)

const reCityCodeCast = /[0-9]{2}/

export const isCityCode = (v: unknown): v is CityCode => {
    return typeof v === 'string' && cityCodes.includes(v)
}

export const isCityCodeLike = (v: unknown): boolean => {
    if (typeof v === 'string') return isCityCode(v)
    if (typeof v === 'number') return (v < 10 && v > 0) || (v < 82 && v > 0)
    return false
}

export const castCityCode = (v: unknown): CityCode => {
    if (typeof v === 'number' && ((v < 10 && v > 0) || (v < 82 && v > 0))) {
        return v < 10 ? '0' + v.toString() : v.toString()
    }

    if (typeof v === 'string') {
        const result = v.match(reCityCodeCast)
        if (Array.isArray(result) && isCityCode(result[0])) {
            return result[0]
        }
    }

    if (isCityCode(v)) {
        return v
    }

    return ''
}

const titleCase = (text: string): string => {
    return text
        .toLocaleLowerCase('TR')
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase('TR') + word.slice(1))
        .join(' ')
}

export const isCityName = (v: unknown): v is CityName => {
    return typeof v === 'string' && cityNames.includes(v)
}

export const isCityNameLike = (v: unknown): boolean => {
    return typeof v === 'string' && isCityName(titleCase(v))
}

export const castCityName = (v: unknown): CityName => {
    return typeof v === 'string' && isCityNameLike(v) ? titleCase(v) : ''
}

export const isCity = (v: unknown): v is City => {
    return typeof v === 'string' && (isCityCode(v) || isCityName(v))
}

export const isObject = (v: unknown): v is object => {
    return typeof v === 'function' || (typeof v === 'object' && !!v)
}

export const findDistance = (code1: CityCode, code2: CityCode): number | undefined => {
    if (isCityCode(code1) && isCityCode(code2)) {
        if (hasProp1(distances, code1)) {
            if (hasProp2(distances[code1], code2)) {
                return (distances[code1] as DistanceChild)[code2 as keyof DistanceChild] || undefined
            }
        }
    }
    return undefined
}

export const findClosestCities = (code: CityCode, threshold = 9999, limit = 100): {code: CityCode, distance: number}[] => {
    if (!hasProp1(distances, code)) {
        return []
    }

    const obj = distances[code] as DistanceChild

    return Object
        .keys(obj)
        .sort((a: CityCode, b: CityCode) => {
            return obj[a as keyof DistanceChild] < obj[b as keyof DistanceChild] ? -1 : obj[a as keyof DistanceChild] > obj[b as keyof DistanceChild] ? 1 : 0
        })
        .map((code2: CityCode) => {
            return {code: code2, distance: obj[code2 as keyof DistanceChild] as number}
        })
        .filter((obj, i) => obj.distance <= threshold && i+1 <= limit)
}

export const getCityNames = (): CityName[] => {
    return cityNames
}

export const getCityCodes = (): CityCode[] => {
    return cityCodes
}

export const getCities = (): CityListItem[] => {
    return cityList
}

export const getPostalCodes = (): PostalCode[] => {
    return postalCodes
}

export const isPostalCode = (v: unknown): v is PostalCode => {
    return postalCodes.includes(v)
}

export const getCityDistricts = (code: CityCode): string[] => {
    return cityCodeDistrictsMap[code] || []
}

export const getCityDistrictNeighbourhoods = (code: CityCode): {[index: string]: string[]} => {
    return cityCodeDistrictNeighbourhoodsMap[code] || {}
}

export {cityCodeDistrictsMap as turkeyCityCodeDistricts}
export {cityCodeDistrictNeighbourhoodsMap as turkeyCityCodeDistrictNeighbourhoods}