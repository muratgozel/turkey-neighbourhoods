const fs = require('fs')
const path = require('path')
const {validationkit} = require('basekits')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'zipcode_list.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const zipcodes = data
  .map(obj => obj.PK)
  .filter(c => validationkit.isNotEmpty(c))
  .filter((c, i, arr) => arr.indexOf(c) === i)

fs.writeFileSync(targetFilePath, JSON.stringify(zipcodes), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
