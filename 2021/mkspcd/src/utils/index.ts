export { converter } from './converter'
export { decoder } from './decoder'
export { matrix } from './matrix'
export { reader } from './reader'

type Utils = {
  filterEmptyLines: (str: string[]) => string[]
  parseStringToNumber: (s: string) => number
}

export const utils: Utils = {
  filterEmptyLines: function(arr: string[]) {
    return arr.filter(line => line.length > 0)
  },

  parseStringToNumber: function(s: string) {
    return parseInt(s, 10)
  },
}
