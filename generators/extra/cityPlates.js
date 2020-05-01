const fs = require('fs')
const path = require('path')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'cityPlates.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const cityPlates = data.reduce(function(memo, item) {
  memo[item.il] = item.PK.slice(0, 2)
  return memo
}, {})

fs.writeFileSync(targetFilePath, JSON.stringify(cityPlates), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
