import {expect, test} from '@jest/globals'
import {isCityCode, isCityCodeLike, castCityCode, isCityName, isCityNameLike, castCityName,
    findDistance, findClosestCities} from '../build'

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