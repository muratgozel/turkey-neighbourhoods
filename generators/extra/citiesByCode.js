const fs = require('fs')
const path = require('path')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'cities_by_code.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const result = []
const usedCodes = []
for (var i = 0; i < data.length; i++) {
  const item = data[i]
  const code = item.PK.slice(0, 2)
  if (usedCodes.indexOf(code) === -1) {
    result.push([code, item.il])
    usedCodes.push(code)
  }
}

fs.writeFileSync(targetFilePath, JSON.stringify(result), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
