import getSlug from 'speakingurl'

const result = getSlug('İstanbul'.toLocaleLowerCase('TR'), {lang: 'tr', maintainCase: true})
console.log(result)