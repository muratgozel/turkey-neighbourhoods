import { distances } from '#src/data/distances/distances';
import { codes as cityCodes } from '#src/data/city/codes';
import { names as cityNames } from '#src/data/city/names';
import { list as cityList } from '#src/data/city/list';
import { postalCodes } from '#src/data/postalCode/list';
import { mapCodeDistricts as cityCodeDistrictsMap } from '#src/data/city/mapCodeDistricts';
import { mapCodeDistrictNeighbourhoods as cityCodeDistrictNeighbourhoodsMap } from '#src/data/city/mapCodeDistrictNeighbourhoods';
const hasProp1 = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const hasProp2 = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const reCityCodeCast = /[0-9]{2}/;
export const isCityCode = (v) => {
    return typeof v === 'string' && cityCodes.includes(v);
};
export const isCityCodeLike = (v) => {
    if (typeof v === 'string')
        return isCityCode(v);
    if (typeof v === 'number')
        return (v < 10 && v > 0) || (v < 82 && v > 0);
    return false;
};
export const castCityCode = (v) => {
    if (typeof v === 'number' && ((v < 10 && v > 0) || (v < 82 && v > 0))) {
        return v < 10 ? '0' + v.toString() : v.toString();
    }
    if (typeof v === 'string') {
        const result = v.match(reCityCodeCast);
        if (Array.isArray(result) && isCityCode(result[0])) {
            return result[0];
        }
    }
    if (isCityCode(v)) {
        return v;
    }
    return '';
};
const titleCase = (text) => {
    return text
        .toLocaleLowerCase('TR')
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase('TR') + word.slice(1))
        .join(' ');
};
export const isCityName = (v) => {
    return typeof v === 'string' && cityNames.includes(v);
};
export const isCityNameLike = (v) => {
    return typeof v === 'string' && isCityName(titleCase(v));
};
export const castCityName = (v) => {
    return typeof v === 'string' && isCityNameLike(v) ? titleCase(v) : '';
};
export const isCity = (v) => {
    return typeof v === 'string' && (isCityCode(v) || isCityName(v));
};
export const isObject = (v) => {
    return typeof v === 'function' || (typeof v === 'object' && !!v);
};
export const findDistance = (code1, code2) => {
    if (isCityCode(code1) && isCityCode(code2)) {
        if (hasProp1(distances, code1)) {
            if (hasProp2(distances[code1], code2)) {
                return distances[code1][code2] || undefined;
            }
        }
    }
    return undefined;
};
export const findClosestCities = (code, threshold = 9999, limit = 100) => {
    if (!hasProp1(distances, code)) {
        return [];
    }
    const obj = distances[code];
    return Object
        .keys(obj)
        .sort((a, b) => {
        return obj[a] < obj[b] ? -1 : obj[a] > obj[b] ? 1 : 0;
    })
        .map((code2) => {
        return { code: code2, distance: obj[code2] };
    })
        .filter((obj, i) => obj.distance <= threshold && i + 1 <= limit);
};
export const getCityNames = () => {
    return cityNames;
};
export const getCityCodes = () => {
    return cityCodes;
};
export const getCities = () => {
    return cityList;
};
export const getPostalCodes = () => {
    return postalCodes;
};
export const isPostalCode = (v) => {
    return postalCodes.includes(v);
};
export const getCityDistricts = (code) => {
    return cityCodeDistrictsMap[code] || [];
};
export const getCityDistrictNeighbourhoods = (code) => {
    return cityCodeDistrictNeighbourhoodsMap[code] || {};
};
export { cityCodeDistrictsMap as turkeyCityCodeDistricts };
export { cityCodeDistrictNeighbourhoodsMap as turkeyCityCodeDistrictNeighbourhoods };
