const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx')
const citiesByCode = require('../../data/extra/cities_by_code.json')
const {updateSizeReport} = require('../../helpers')

function sortCitiesByCode(citiesByCode) {
  const obj = citiesByCode
    .reduce(function(memo, arr) {
      const code = arr[0]
      const city = arr[1]
      memo[code] = city
      return memo
    }, {})
  const codes = Object.keys(obj).sort(function(a, b) {
    if (parseFloat(a) < parseFloat(b)) return -1
    else return 1
  })

  return codes.reduce(function(memo, code) {
    memo[code] = obj[code]
    return memo
  }, {})
}

const cities = sortCitiesByCode(citiesByCode)

const workbook = XLSX.readFile('./storage/ilmesafe.xls')
const worksheet = workbook.Sheets[workbook.SheetNames[0]]
const arr = XLSX.utils.sheet_to_json(worksheet)

const map = arr.reduce(function(memo, obj) {
  const currentCode = Object.values(obj)[0]
  if (!cities.hasOwnProperty(currentCode)) {
    return memo
  }

  const distancemap = Object.keys(obj)
    .filter(n => n.indexOf('__EMPTY_') !== -1)
    .reduce(function(mem, name) {
      const n = name.replace('__EMPTY_', '')
      const nn = n.length === 1 ? '0' + n : n
      const distance = obj['__EMPTY_' + n]
      mem[nn] = distance
      return mem
    }, {[currentCode]: 0})

  memo[currentCode] = distancemap

  return memo
}, {})

const dest = path.join('data/core', 'city_distances.json')
fs.writeFileSync(dest, JSON.stringify(map))
updateSizeReport(dest, 'core')
