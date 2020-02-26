const fs = require('fs')
const path = require('path')
const kit = require('@basekits/core')
const kitType = require('@basekits/kit-type')
const kitObject = require('@basekits/kit-object')
const kitError = require('@basekits/kit-error')
const kitValidator = require('@basekits/kit-validator')
kit.addKit(kitType)
kit.addKit(kitObject)
kit.addKit(kitError)
kit.addKit(kitValidator)
const {updateSizeReport} = require('../../helpers')

const dataFilePath = path.join('data/core', 'index.json')
const targetFilePath = path.join('data/extra', 'neighbourhoods.json')

const data = JSON.parse( fs.readFileSync(dataFilePath, 'utf8') )
const tree = data.reduce(function(memo, obj) {
  if (kit.isNotEmpty(obj.il)) {
    if (kit.isEmpty(memo[obj.il])) memo[obj.il] = {}
    if (kit.isEmpty(memo[obj.il][obj['ilçe']])) memo[obj.il][obj['ilçe']] = []
    memo[obj.il][obj['ilçe']].push(obj.Mahalle)
  }
  return memo
}, {})

fs.writeFileSync(targetFilePath, JSON.stringify(tree), 'utf8')
updateSizeReport(targetFilePath, 'extra')
console.log(path.basename(targetFilePath) + ' has been created successfully.')
