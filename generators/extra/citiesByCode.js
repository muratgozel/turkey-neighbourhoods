const fs = require('fs')
const path = require('path')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'cities_by_code.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const cityPlates = data.reduce(function(memo, item) {
  memo[item.PK.slice(0, 2)] = item.il
  return memo
}, {})

fs.writeFileSync(targetFilePath, JSON.stringify(cityPlates), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
