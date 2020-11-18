const caseTransformations = {
  'I': 'ı',
  'İ': 'i',
  'Ü': 'ü',
  'Ö': 'ö',
  'Ç': 'ç',
  'Ğ': 'ğ',
  'Ş': 'ş'
}

function uppercase(str) {
  const newStr = []
  const arr = Object.keys(caseTransformations)
  const specialChars = Object.values(caseTransformations)
  for (let i = 0; i < str.length; i++) {
    const ind = specialChars.indexOf(str[i])
    const char = ind !== -1 ? arr[ind] : str[i].toUpperCase()
    newStr.push(char)
  }
  return newStr.join('')
}

function lowercase(str) {
  const newStr = []
  const arr = Object.values(caseTransformations)
  const specialChars = Object.keys(caseTransformations)
  for (let i = 0; i < str.length; i++) {
    const ind = specialChars.indexOf(str[i])
    const char = ind !== -1 ? arr[ind] : str[i].toLowerCase()
    newStr.push(char)
  }
  return newStr.join('')
}

function titlecase(str) {
  return uppercase(str.slice(0, 1)) + lowercase(str.slice(1))
}

function camelcase(str) {
  return str.split('_').map((s, i) => i === 0 ? s : titlecase(s)).join('')
}

module.exports = {
  uppercase: uppercase,
  lowercase: lowercase,
  titlecase: titlecase,
  camelcase: camelcase
}
