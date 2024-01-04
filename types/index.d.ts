declare module 'turkey-neighbourhoods' {
    import { type CityCode } from '../src/data/city/codes'
    import { type CityName } from '../src/data/city/names'
    import { type CityListItem } from '../src/data/city/list'
    import { type CityCodeNameMap } from '../src/data/city/mapCodeName'
    import { type CityCodeDistrictMap } from '../src/data/city/mapCodeDistricts'
    import { type CityCodeDistrictNeighbourhoodsMap } from '../src/data/city/mapCodeDistrictNeighbourhoods'
    import { type DistanceChild } from '../src/data/distances/distances'
    import { type Distances } from '../src/data/distances/distances'

    export { type CityCode } from '../src/data/city/codes'
    export { type CityName } from '../src/data/city/names'
    export { type CityListItem } from '../src/data/city/list'
    export { type CityCodeNameMap } from '../src/data/city/mapCodeName'
    export { type CityCodeDistrictMap } from '../src/data/city/mapCodeDistricts'
    export { type CityCodeDistrictNeighbourhoodsMap } from '../src/data/city/mapCodeDistrictNeighbourhoods'
    export { type DistanceChild } from '../src/data/distances/distances'
    export { type Distances } from '../src/data/distances/distances'

    export type PostalCode = string
    export type NeighbourhoodList = [CityCode, CityName, string, string, string][]
    export type City = CityCode | CityName

    export function isCityCode(v: unknown): v is CityCode
    export function isCityCodeLike(v: unknown): boolean
    export function castCityCode(v: unknown): CityCode | ''
    export function isCityName(v: unknown): v is CityName
    export function isCityNameLike(v: unknown): boolean
    export function castCityName(v: unknown): CityName | ''
    export function isCity(v: unknown): v is City
    export function isPostalCode(v: unknown): v is PostalCode
    export function findDistance(from: City, to: City): number | undefined
    export function findClosestCities(from: City, limit?: number): {code: CityCode, distance: number}[]
    export function getCityNames(): CityName[]
    export function getCityCodes(): CityCode[]
    export function getCities(): CityListItem[]
    export function getPostalCodes(): PostalCode[]
    export function getDistrictsByCityCode(city: CityCode): string[]
    export function getDistrictsOfEachCity(): CityCodeDistrictMap
    export function getDistrictsAndNeighbourhoodsByCityCode(city: CityCode): string[]
    export function getDistrictsAndNeighbourhoodsOfEachCity(): CityCodeDistrictNeighbourhoodsMap
    export function getNeighbourhoodsByCityCodeAndDistrict(code: CityCode, district: string): string[]
}