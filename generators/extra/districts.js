const fs = require('fs')
const path = require('path')
const {validationkit} = require('basekits')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'districts.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const tree = data.reduce(function(memo, obj) {
  if (validationkit.isNotEmpty(obj.il)) {
    if (validationkit.isEmpty(memo[obj.il])) memo[obj.il] = []
    if (memo[obj.il].indexOf(obj['ilçe']) === -1) memo[obj.il].push(obj['ilçe'])
  }
  return memo
}, {})

fs.writeFileSync(targetFilePath, JSON.stringify(tree), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
