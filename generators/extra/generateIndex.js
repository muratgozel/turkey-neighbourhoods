const fs = require('fs')
const path = require('path')
const {casing} = require('../../helpers')
const {camelcase} = casing

const files = fs.readdirSync('./data/extra').filter(f => path.extname(f) == '.json')
const filedata = files.reduce(function(memo, file) {
  const prop = path.basename(file, path.extname(file))
  memo += `  ${camelcase(prop)}: require('./${prop}.json'),\r\n`
  return memo
}, '  divisions: require(\'./divisions\'),\r\n')
fs.writeFileSync(path.join('data/extra/index.js'), `module.exports = {\r\n${filedata}}`)
