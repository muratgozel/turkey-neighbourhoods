import {expect, test} from '@jest/globals'
import {isCityCode, isCityCodeLike, castCityCode, isCityName, isCityNameLike, castCityName,
    findDistance, findClosestCities, getDistrictsByCityCode, getDistrictsOfEachCity,
    getDistrictsAndNeighbourhoodsByCityCode, getDistrictsAndNeighbourhoodsOfEachCity,
    getNeighbourhoodsByCityCodeAndDistrict} from '../build'

test('validates city codes', () => {
    expect(isCityCode('01')).toBe(true)
    expect(isCityCode('41')).toBe(true)
    expect(isCityCode('82')).toBe(false)
    expect(isCityCode(1)).toBe(false)
    expect(isCityCodeLike(1)).toBe(true)
    expect(isCityCodeLike(0)).toBe(false)
    expect(isCityCodeLike(82)).toBe(false)
})

test('cast inputs to city codes', () => {
    expect(castCityCode('01')).toBe('01')
    expect(castCityCode('abc')).toBe('')
    expect(castCityCode(' 01 ')).toBe('01')
    expect(castCityCode('abc41ğşr ')).toBe('41')
    expect(castCityCode('abc34lşd01d')).toBe('34')
})

test('validates city names', () => {
    expect(isCityName('01')).toBe(false)
    expect(isCityName('İstanbul')).toBe(true)
    expect(isCityName('istanbul')).toBe(false)
    expect(isCityNameLike('istanbul')).toBe(true)
    expect(isCityNameLike('abc istanbul edf')).toBe(false)
})

test('cast inputs to city names', () => {
    expect(castCityName('İstanbul')).toBe('İstanbul')
    expect(castCityName('istanbul')).toBe('İstanbul')
    expect(castCityName('abc istanbul edf')).toBe('')
})

test('finds distance between two cities', () => {
    expect(findDistance('41', '16')).toBe(131)
    expect(findDistance('34', '41')).toBe(113)
})

test('finds closest cities to a particular city', () => {
    const result = findClosestCities('16', 200, 3)
    expect(result).toContainEqual({code: '77', distance: 69})
    expect(result).toContainEqual({code: '11', distance: 95})
    expect(result).toContainEqual({code: '41', distance: 131})
    expect(result.length).toBe(3)
})

test('get districts by city code', () => {
    expect(getDistrictsByCityCode('16')).toContainEqual('Osmangazi')
    expect(getDistrictsByCityCode('16')).toContainEqual('Yıldırım')
})

test('get districts of each city', () => {
    const d = getDistrictsOfEachCity()
    expect(d).toHaveProperty('16')
    expect(d['16']).toContainEqual('Osmangazi')
    expect(d['16']).toContainEqual('Yıldırım')
    expect(d['16']).toContainEqual('Mudanya')
    expect(Object.keys(d).length).toBeGreaterThan(80)
})

test('get districts and neighbourhoods by city code', () => {
    const n = getDistrictsAndNeighbourhoodsByCityCode('16')
    expect(n).toHaveProperty('Nilüfer')
    expect(n['Nilüfer']).toContainEqual('Alaaddinbey Mah')
    expect(n['Nilüfer']).toContainEqual('Ataevler Mah')
    expect(n['Nilüfer']).toContainEqual('Özlüce Mah')
})

test('get districts and neighbourhoods of each city', () => {
    const n = getDistrictsAndNeighbourhoodsOfEachCity()
    expect(n).toHaveProperty('16')
    expect(n['16']).toHaveProperty('Nilüfer')
    expect(n['16']['Nilüfer']).toContainEqual('Alaaddinbey Mah')
    expect(n['16']['Nilüfer']).toContainEqual('Ataevler Mah')
    expect(n['16']['Nilüfer']).toContainEqual('Özlüce Mah')
    expect(n).toHaveProperty('34')
    expect(n['34']).toHaveProperty('Arnavutköy')
    expect(n['34']['Arnavutköy']).toContainEqual('İmrahor Mah')
    expect(n['34']['Arnavutköy']).toContainEqual('Baklalı Mah')
    expect(n['34']['Arnavutköy']).toContainEqual('Durusu Mah')
})

test('get neighbourhoods by city code and district', () => {
    const n = getNeighbourhoodsByCityCodeAndDistrict('16', 'Nilüfer')
    expect(n).toContainEqual('Alaaddinbey Mah')
    expect(n).toContainEqual('Ataevler Mah')
})