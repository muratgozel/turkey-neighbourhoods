# turkey-neighbourhoods
Always up to date names of cities, districts and neighbourhoods in Turkey.

![NPM](https://img.shields.io/npm/l/turkey-neighbourhoods)
[![npm version](https://badge.fury.io/js/turkey-neighbourhoods.svg)](https://badge.fury.io/js/turkey-neighbourhoods)
![npm](https://img.shields.io/npm/dy/turkey-neighbourhoods)

Data is available as JSON and being fetched regularly from a reliable source.

**In Turkish**
JSON formatında, her zaman güncel, Türkiye şehir, posta kodu, plaka kodu, ilçe ve mahalle listesi. Veri düzenli olarak güncellenen güvenilir kaynaktan alınıyor. Alınan veri farklı şekillerde derlenerek yazılımcının kullanımına hazır hale getiriliyor.

## ⭐️ New Feature: City Distances (as of v2.1)
Now there is map that contains the distances between two cities in json format.
It's available under `core/city_distances.json`. The distance between two city is the distance between center of both cities.

## Install
Through npm:
```sh
npm i turkey-neighbourhoods
```
or you clone the repository directly. The generated data available inside the `data` folder.

## Using Generated Data
The generated data is available under `data` directory. There are two folders here:
1. `core` which is the data as it is fetched from a remote source in json format.
2. `extra` contains collections generated from a data inside `core`.
Generated data is pre-generated and always up-to-date. You can import whichever data you want into your project by just requiring:
```js
// raw json data as fetched
const coreData = require('turkey-neighbourhoods/data/core/index.json')
// list of city names
const cities = require('turkey-neighbourhoods/data/extra/city_list.json')
// list of cities by city code (city code is plate number in Turkey)
const citiesByCode = require('turkey-neighbourhoods/data/extra/cities_by_code.json')
// list city codes
const cityCodes = require('turkey-neighbourhoods/data/extra/city_code_list.json')
// districts by city code
const districts = require('turkey-neighbourhoods/data/extra/districts_by_city.json')
// neighbourhoods by district and city
const neighbourhoods = require('turkey-neighbourhoods/data/extra/neighbourhoods.json')
// zip codes
const zipcodes = require('turkey-neighbourhoods/data/extra/zipcodes_list.json')

// and more inside data folder.
```
Or you can require all of it:
```js
const data = require('turkey-neighbourhoods')
// data has core and extra.
```

## Using City Distances
```js
const distances = require('turkey-neighbourhoods/core/city_distances.json')
// distance between istanbul and antalya
const d = distances['34']['07'] // 717 (in kilometers)
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
New data releases will be patch level updates in terms of semver.

## Data Size Report
Be careful with importing the data into your bundles for browsers since the data may increase your bundle size dramatically.

Please refer to the file [dataSizeReport.json](https://github.com/muratgozel/turkey-neighbourhoods/blob/master/dataSizeReport.json) that shows the size of each data item in kilobytes.

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
