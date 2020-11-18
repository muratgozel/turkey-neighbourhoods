const fs = require('fs')
const path = require('path')
const {validationkit} = require('basekits')
const {updateSizeReport, casing} = require('../../helpers')
const {camelcase} = casing

fs.mkdirSync(path.join('data/extra/divisions'), {recursive: true})

const citiesByCode = require('../../data/extra/cities_by_code.json')
const districtsByCity = require('../../data/extra/districts_by_city.json')
const neighbourhoodsByDistrictAndCity = require('../../data/extra/neighbourhoods_by_district_and_city.json')
const cityCodes = Object.keys(neighbourhoodsByDistrictAndCity)
const indexFileData = []
for (let i = 0; i < cityCodes.length; i++) {
  const cityCode = cityCodes[i]
  fs.mkdirSync(path.join('data/extra/divisions', cityCode), {recursive: true})
  const meta = JSON.stringify({code: cityCode, name: citiesByCode[cityCode]})
  fs.writeFileSync(path.join('data/extra/divisions', cityCode, 'meta.json'), meta)
  const districts = JSON.stringify(districtsByCity[cityCode])
  fs.writeFileSync(path.join('data/extra/divisions', cityCode, 'districts.json'), districts)
  const neighbourhoods = JSON.stringify(neighbourhoodsByDistrictAndCity[cityCode])
  fs.writeFileSync(path.join('data/extra/divisions', cityCode, 'neighbourhoods.json'), neighbourhoods)
  const cityIndexData = `module.exports = {
  meta: require('./meta.json'),
  districts: require('./districts.json'),
  neighbourhoods: require('./neighbourhoods.json')
}`
  fs.writeFileSync(path.join('data/extra/divisions', cityCode, 'index.js'), cityIndexData)
  indexFileData.push(`  '${cityCode}': require('./${cityCode}'),\r\n`)
}
fs.writeFileSync(path.join('data/extra/divisions/index.js'), `module.exports = {\r\n${indexFileData.join('')}}`)
console.log('Divisions folder has been created successfully.')
