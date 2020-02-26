# turkey-neighbourhoods
Always up to date names of cities, districts and neighbourhoods in Turkey.

Data is available as JSON and being fetched regularly from ptt.gov.tr which is a reliable source for Turkey divisions.

**In Turkish**
JSON formatında, her zaman güncel, Türkiye şehir, posta kodu, plaka kodu, ilçe ve mahalle listesi. Veri ptt.gov.tr'den alınıyor. Alınan veri farklı şekillerde derlenerek yazılımcının kullanımına hazır hale getiriliyor.

## Install
Through npm:
```sh
npm i turkey-neighbourhoods
```

## Using Generated Data
The generated data is available under `data` directory. It's pre-generated and stays up to date by regenerating the data on each month. You can import whichever data you want into your project by just requiring:
```js
// raw json data as fetched
const coreData = require('turkey-neighbourhoods/data/core/index.json')
// list of cities
const cities = require('turkey-neighbourhoods/data/extra/cities.json')
// license plates by city name
const cityPlates = require('turkey-neighbourhoods/data/extra/cityPlates.json')
// districts by city
const districts = require('turkey-neighbourhoods/data/extra/districts.json')
// neighbourhoods by district and city
const neighbourhoods = require('turkey-neighbourhoods/data/extra/neighbourhoods.json')
// license plates list
const plates = require('turkey-neighbourhoods/data/extra/plates.json')
// zip codes
const zipcodes = require('turkey-neighbourhoods/data/extra/zipcodes.json')
```
Or you can require all of it:
```js
const data = require('turkey-neighbourhoods')
// data has core and extra.
```

## About Generators
Generators grouped by their function.

### Core Generators
The scripts in `generators/core` folder fetch and parse the data from a chosen reliable source.

### Extra Generators
The scripts in `generators/extra` folder parse the data from `data/core/somefile` file.

## About Generated Data
The generated data is available under `data` directory. It's pre-generated. There is no need to generate any data when you install this package. However, sources that this package uses to generate data may update theirself overtime. Generally once a month. If you want to stay up to date, you need to update this package in your project:
```sh
npm update
```
New data releases will be minor updates.

## Data Size Report
Be careful with importing the data into your bundles for browsers since the data may increase your bundle size dramatically.

Please refer to the file [dataSizeReport.json](https://github.com/muratgozel/turkey-neighbourhoods/blob/master/dataSizeReport.json) that shows the size of each data item in kilobytes.
