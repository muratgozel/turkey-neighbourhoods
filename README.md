# turkey-neighbourhoods
Always up to date names of cities, districts and neighbourhoods of Turkey, available as JSON and JS. Refer to https://muratgozel.github.io/turkey-neighbourhoods/ for full api documentation.

**In Turkish: **
JSON ve JS formatında, her zaman güncel, Türkiye şehir, posta kodu, plaka kodu, ilçe ve mahalle listesi.

## ⭐ Breaking Changes in v3
In v3, I extended the scope of the package, basically made it a module that has the necessary methods to interact with the data.

## ⭐️ New Feature: City Distances (as of v2.1)
Now there is map that contains the distances between two cities in json format.

## Install
```sh
npm i turkey-neighbourhoods
```

## Usage
The package contains large amount of data which is not suitable for browser environment. Benefit from tree-shaking might work if you are interested in small chunks of it.

There are couple of methods to interact with the data:
```js
import {isCityCode, isCityCodeLike, castCityCode, isCityName, isCityNameLike, castCityName,
    findDistance, findClosestCities} from 'turkey-neighbourhoods'

isCityCode('01') // true
isCityCode('82') // false
isCityCode(1) // false
isCityCodeLike(1) // true

castCityCode(' 01 ') // "01"
castCityCode('abc') // ""

isCityName('İstanbul') // true
isCityName('istanbul') // false, because city names are always title cased
isCityNameLike('istanbul') // true

castCityName('istanbul') // "İstanbul"

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
Data updates published regularly as `minor` releases so you only need to update the package as new version comes in. If you have a kind of manual setup, you can run `npm run setup`, `compile`, `build` and `test` to fetch the new data. The module is smart enough to detect if the existing data is fresh or not.

## Contributing
If you're interested in contributing, read the [CONTRIBUTING.md](https://github.com/muratgozel/muratgozel/blob/main/CONTRIBUTING.md) first, please.

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![Support me on Patreon](https://cdn.muratgozel.com.tr/support-me-on-patreon.v1.png)](https://patreon.com/muratgozel?utm_medium=organic&utm_source=github_repo&utm_campaign=github&utm_content=join_link)
