const fs = require('fs')
const path = require('path')
const {validationkit} = require('basekits')
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'districts_by_city.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const tree = data.reduce(function(memo, obj) {
  if (validationkit.isNotEmpty(obj.il) && validationkit.isNotEmpty(obj.PK)) {
    const prop = obj.PK.slice(0, 2)
    if (validationkit.isEmpty(memo[prop])) memo[prop] = []
    if (memo[prop].indexOf(obj['ilçe']) === -1) memo[prop].push(obj['ilçe'])
  }
  return memo
}, {})

fs.writeFileSync(targetFilePath, JSON.stringify(tree), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
