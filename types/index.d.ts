declare module 'turkey-neighbourhoods' {
    export type CityCode = import('#src/data/city/codes').CityCode
    export type CityName = import('#src/data/city/names').CityName
    export type CityListItem = import('#src/data/city/list').CityListItem
    export type CityCodeNameMap = import('#src/data/city/mapCodeName').CityCodeNameMap
    export type CityCodeDistrictMap = import('#src/data/city/mapCodeDistricts').CityCodeDistrictMap
    export type CityCodeDistrictNeighbourhoodsMap = import('#src/data/city/mapCodeDistrictNeighbourhoods').CityCodeDistrictNeighbourhoodsMap
    export type PostalCode = import('#src/data/postalCode/list').PostalCode
    export type DistanceChild = import('#src/data/distances/distances').DistanceChild
    export type Distances = import('#src/data/distances/distances').Distances
    export type NeighbourhoodList = import('#src/data/neighbourhoods/neighbourhoods').NeighbourhoodList

    export type City = CityCode | CityName

    export type isCityCode = (v: unknown) => v is CityCode
    export type isCityCodeLike = (v: unknown) => boolean
    export type castCityCode = (v: unknown) => CityCode | ''
    export type isCityName = (v: unknown) => v is CityName
    export type isCityNameLike = (v: unknown) => boolean
    export type castCityName = (v: unknown) => CityName | ''
    export type isCity = (v: unknown) => v is City
    export type isPostalCode = (v: unknown) => v is PostalCode
    export type findDistance = (from: City, to: City) => number | undefined
    export type findClosestCities = (from: City, limit?: number) => {code: CityCode, distance: number}[]
    export type getCityNames = () => CityName[]
    export type getCityCodes = () => CityCode[]
    export type getCities = () => CityListItem[]
    export type getPostalCodes = () => PostalCode[]
    export type getCityDistricts = (city: City) => string[]
    export type getAllCityDistricts = () => CityCodeDistrictMap
    export type getCityDistrictNeighbourhoods = (city: City, district: string) => string[]
    export type getAllNeighbourhoods = () => CityCodeDistrictNeighbourhoodsMap
}