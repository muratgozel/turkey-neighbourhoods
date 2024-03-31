# turkey-neighbourhoods
Always up to date names of cities, districts and neighbourhoods of Turkey + city distances.

**In Turkish: **
Her zaman güncel, Türkiye şehir, posta kodu, plaka kodu, ilçe ve mahalle listesi + şehirlerarası mesafeler.

## Install
```sh
npm i turkey-neighbourhoods
```
or inject with script tag:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/turkey-neighbourhoods@4/dist/index.js"></script>
```

## Usage
The package contains large amount of data which is not suitable for browser environment. Benefit from tree-shaking might work if you are interested in small chunks of it.

There are no **states** in Turkey. The data structured as cities (city code and name), districts (name) and neighbourhoods (name). City codes are two digit text and they also known as plate number.

There are couple of methods to interact with the data:
```js
import {
    isCityCode,
    isCityName,
    isPostalCode,
    getCityNames,
    getCityCodes,
    getCities,
    getPostalCodes,
    getDistrictsByCityCode,
    getDistrictsOfEachCity,
    getDistrictsAndNeighbourhoodsByCityCode,
    getDistrictsAndNeighbourhoodsOfEachCity,
    getNeighbourhoodsByCityCodeAndDistrict,
    findDistance,
    findClosestCities
} from 'turkey-neighbourhoods'

isCityCode('01') // true
isCityCode('82') // false
isCityCode(1) // false

isCityName('İstanbul') // true
isCityName('istanbul') // false, because city names are always title cased

getCityCodes() // ["01", "02", ... "67"] sorted by name, 81 in total
getCityNames() // ["Adana", "Adıyaman", ... "Zonguldak"]
getCities() // [{code: "01", name: "Adana"}, ... {code: "67", name: "Zonguldak"}]

getPostalCodes() // ["01720", ... "67100"]
isPostalCode('01720') // true

getDistrictsByCityCode('16') // ["Büyükorhan", "Gemlik", "Gürsu", ... "Yıldırım"]
getDistrictsOfEachCity() // {"16": ["Nilüfer", ...]}
getDistrictsAndNeighbourhoodsByCityCode('16') // {"Büyükorhan": ["Akçasaz Mah", "Aktaş Mah", ...], "Gemlik": ["Adliye Mah", ...], ...}
getDistrictsAndNeighbourhoodsOfEachCity() // {"16": {"Gemlik": ["Adliye Mah", ...] ...} ...}
getNeighbourhoodsByCityCodeAndDistrict("16", "Nilüfer") // ["Alaaddinbey Mah", "Ataevler Mah" ...]

// find distance between two cities in kilometers based on the roads
findDistance('41', '16') // 131

// find closest cities to a particular city, 200 km far at most and limit results to three
findClosestCities('16', 200, 3) // [{code: '77', distance: 69}, ...]
```
Have a look at the tests, types and source for more info.

## Keeping Data Up To Date
Data updates published regularly as `minor` releases so check regularly for updates. The data source updates it every month.

## Contributing
If you're interested in contributing, read the [CONTRIBUTING.md](https://github.com/muratgozel/muratgozel/blob/main/CONTRIBUTING.md) first, please.

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![Support me on Patreon](https://cdn.muratgozel.com.tr/support-me-on-patreon.v1.png)](https://patreon.com/muratgozel?utm_medium=organic&utm_source=github_repo&utm_campaign=github&utm_content=join_link)
