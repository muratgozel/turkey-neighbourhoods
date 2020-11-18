const fs = require('fs')
const path = require('path')
const {validationkit} = require('basekits')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'city_code_list.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const licensePlateCodes = data
  .filter(c => validationkit.isNotEmpty(c) && validationkit.isNotEmpty(c.PK))
  .map(obj => obj.PK.slice(0, 2))
  .filter((c, i, arr) => arr.indexOf(c) === i)

fs.writeFileSync(targetFilePath, JSON.stringify(licensePlateCodes), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
