const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const StreamZip = require('node-stream-zip')
const XLSX = require('xlsx')
const {updateSizeReport, casing} = require('../../helpers')
const {titlecase} = casing

const url = 'http://postakodu.ptt.gov.tr/Dosyalar/pk_list.zip'
const filename = 'index.json'
const storagePath = 'storage'
const dest = path.join('data/core', filename)
const requestOptions = {
  method: 'GET',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0',
    Referer: 'http://postakodu.ptt.gov.tr/',
    Host: 'postakodu.ptt.gov.tr'
  }
}

function checkIfDataUpdated() {
  return new Promise(function(resolve, reject) {
    const lightRequestOptions = Object.assign({}, requestOptions, {method: 'HEAD'})
    fetch(url, lightRequestOptions)
      .then(function(res) {
        const etag = res.headers.get('etag').replace(/"+/g, '')
        // compare new etag with our previously stored etag
        const etagFile = path.join(storagePath, 'etag')
        if (fs.existsSync(etagFile)) {
          if (etag == fs.readFileSync(etagFile, 'utf8')) {
            return resolve(false)
          }
        }
        fs.writeFileSync(etagFile, etag, 'utf8')
        return resolve(true)
      })
      .catch(function(err) {
        throw err
      })
  })
}

function fetchAndParse() {
  const stream = fs.createWriteStream(path.join(storagePath, 'pk_list.zip'))

  return new Promise(function(resolve, reject) {
    fetch(url)
      .then(function(res) {
        res.body.pipe(stream)

        res.body.on('error', function(err) {
          stream.close()
          throw err
        })

        stream.on('finish', function() {
          stream.close()

          // unzip
          const zip = new StreamZip({
            file: path.join(storagePath, 'pk_list.zip'),
            storeEntries: true
          })

          zip.on('error', function(err) {
            throw err
          })

          zip.on('ready', function() {
            for (const entry of Object.values(zip.entries())) {
              if (path.extname(entry.name) == '.xlsx') {
                zip.extract(entry.name, storagePath + '/' + entry.name, function(err) {
                  if (err) throw err
                  zip.close()

                  // json
                  const workbook = XLSX.readFile(storagePath + '/' + entry.name)
                  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                  const json = XLSX.utils.sheet_to_json(worksheet)
                  const trimmed = json.map(function(obj) {
                    const neighbourhoodKey = obj.hasOwnProperty('Mahalle')
                      ? 'Mahalle'
                      : 'Mahalle/Mahalle(köy/belde)'
                    const districtKey = obj.hasOwnProperty('semt/bucak')
                      ? 'semt/bucak'
                      : 'semt_bucak_belde'
                    const neighbourhood = obj[neighbourhoodKey]
                      .trim()
                      .replace(' MAH', '')
                      .replace(' KÖYÜ', '')

                    obj.il = titlecase(obj.il.trim())
                    obj['ilçe'] = titlecase(obj['ilçe'].trim())
                    obj[districtKey] = titlecase(obj[districtKey].trim())
                    obj[neighbourhoodKey] = titlecase(neighbourhood)
                    obj.PK = obj.PK.trim()
                    return obj
                  })
                  fs.writeFileSync(dest, JSON.stringify(json))
                  updateSizeReport(dest, 'core')

                  return resolve()
                })
              }
            }
          })
        })
      })
      .catch(function(err) {
        throw err
      })
  })
}

console.log('Looking up for if we still have the latest version of the data...')

checkIfDataUpdated().then(function(result) {
  if (result === true) {
    console.log('There is an update! Fetching the latest version of the data...')

    fetchAndParse().then(function() {
      console.log('Data is ready to use.')
    })
  }
  else {
    console.log('Yes we still have the latest version of the data.')
  }
})
