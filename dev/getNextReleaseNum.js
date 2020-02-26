const fs = require('fs')

const releaseType = process.argv[2]

// VERSION file holds the current version number
const exists = fs.existsSync('./VERSION')
if (exists !== true) {
  fs.writeFileSync('./VERSION', '0.1.0')
}
const raw = fs.readFileSync('./VERSION', 'utf8')
const re = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
const matchedReleases = raw.match(re)
const currentRelease = matchedReleases[0]

// increment appropriate release number
const parts = currentRelease.split('.').map(p => parseFloat(p))
if (releaseType == 'major') {
  parts[0] = parts[0] + 1
  parts[1] = 0
  parts[2] = 0
}
else if (releaseType == 'minor') {
  parts[1] = parts[1] + 1
  parts[2] = 0
}
else {
  parts[2] = parts[2] + 1
}
const nextRelease = parts.join('.')

// save next release
fs.writeFileSync('./VERSION', nextRelease, 'utf8')

// update also package.json
if (fs.existsSync('./package.json')) {
  const obj = JSON.parse( fs.readFileSync('./package.json', 'utf8') )
  obj.version = nextRelease
  fs.writeFileSync('./package.json', JSON.stringify(obj, null, 2), 'utf8')
}

process.stdout.write(nextRelease)
