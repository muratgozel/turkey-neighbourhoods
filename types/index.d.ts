declare module 'turkey-neighbourhoods' {
    export type CityCode = import('../src/data/city/codes').CityCode
    export type CityName = import('../src/data/city/names').CityName
    export type CityListItem = import('../src/data/city/list').CityListItem
    export type CityCodeNameMap = import('../src/data/city/mapCodeName').CityCodeNameMap
    export type CityCodeDistrictMap = import('../src/data/city/mapCodeDistricts').CityCodeDistrictMap
    export type CityCodeDistrictNeighbourhoodsMap = import('../src/data/city/mapCodeDistrictNeighbourhoods').CityCodeDistrictNeighbourhoodsMap
    export type PostalCode = string
    export type DistanceChild = import('../src/data/distances/distances').DistanceChild
    export type Distances = import('../src/data/distances/distances').Distances
    export type NeighbourhoodList = import('../src/data/neighbourhoods/neighbourhoods').NeighbourhoodList

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