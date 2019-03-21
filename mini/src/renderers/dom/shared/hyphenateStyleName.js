const uppercasePattern = /([A-Z])/g

export default function hyphenateStyleName(name) {
  return name.replace(uppercasePattern, '-$1').toLowerCase()
}
