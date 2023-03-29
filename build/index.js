import { distances } from '#src/data/distances/distances';
import { codes as cityCodes } from '#src/data/city/codes';
import { names as cityNames } from '#src/data/city/names';
import { list as cityList } from '#src/data/city/list';
import { postalCodes } from '#src/data/postalCode/list';
import { mapCodeDistricts } from '#src/data/city/mapCodeDistricts';
import { mapCodeDistrictNeighbourhoods } from '#src/data/city/mapCodeDistrictNeighbourhoods';
export const isObject = (v) => {
    return (!!v) && (v.constructor === Object);
};
export const isArray = (v) => {
    return (!!v) && (v.constructor === Array);
};
const titleCase = (text) => {
    return text
        .toLocaleLowerCase('TR')
        .split(' ')
        .map(word => word.charAt(0).toLocaleUpperCase('TR') + word.slice(1))
        .join(' ');
};
export const isCityCode = (v) => {
    return typeof v === 'string' && cityCodes.find((code) => code === v) !== undefined;
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
        return (v < 10 ? '0' + v.toString() : v.toString());
    }
    if (typeof v === 'string') {
        const result = v.match(/[0-9]{2}/);
        if (isArray(result) && isCityCode(result[0])) {
            return result[0];
        }
    }
    if (isCityCode(v)) {
        return v;
    }
    return '';
};
export const isCityName = (v) => {
    return typeof v === 'string' && cityNames.find((name) => name === v) !== undefined;
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
export const findDistance = (code1, code2) => {
    if (isCityCode(code1) && isCityCode(code2)) {
        if (Object.hasOwn(distances, code1)) {
            if (Object.hasOwn(distances[code1], code2)) {
                return distances[code1][code2];
            }
        }
    }
    return undefined;
};
export const findClosestCities = (code, threshold = 9999, limit = 100) => {
    if (!Object.hasOwn(distances, code)) {
        return [];
    }
    const obj = distances[code];
    return Object
        .keys(obj)
        .sort((a, b) => {
        return obj[a] < obj[b]
            ? -1
            : obj[a] > obj[b]
                ? 1
                : 0;
    })
        .map((code2) => {
        return { code: code2, distance: obj[code2] };
    })
        .filter((obj, i) => obj.distance <= threshold && i + 1 <= limit);
};
export const getCityNames = () => {
    return Array.from(cityNames);
};
export const getCityCodes = () => {
    return Array.from(cityCodes);
};
export const getCities = () => {
    return cityList;
};
export const getPostalCodes = () => {
    return Array.from(postalCodes);
};
export const isPostalCode = (v) => {
    return typeof v === 'string' && postalCodes.find((code) => code === v) !== undefined;
};
export const getCityDistricts = (code) => {
    return mapCodeDistricts[code] || [];
};
export const getAllCityDistricts = () => {
    return mapCodeDistricts;
};
export const getCityDistrictNeighbourhoods = (code) => {
    return mapCodeDistrictNeighbourhoods[code] || {};
};
export const getAllNeighbourhoods = () => {
    return mapCodeDistrictNeighbourhoods;
};
