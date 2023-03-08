declare module 'turkey-neighbourhoods' {
    import type {CityCode, CityName} from './city'
    import type {PostalCode} from './postalCode'

    export type Primitives =
        | string
        | number
        | bigint
        | boolean
        | symbol
        | null
        | undefined

    export type InferPrimitive<T, P> = P extends any ? T extends P ? P : never : never
    export type Inference<T> = InferPrimitive<T, Primitives>

    export {CityCode, CityName, City, CityListItem, CityCodeNameMap, CityCodeDistrictMap, CityCodeDistrictNeighbourhoodsMap} from './city'
    export {PostalCode} from './postalCode'

    export interface DistanceChild {
        [index: CityCode]: number
    }
    export interface Distances {
        [index: CityCode]: DistanceChild
    }

    export type NeighbourhoodList = Array<Array<CityCode, CityName, string, string, PostalCode>>
}