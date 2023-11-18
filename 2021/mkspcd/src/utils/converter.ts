import { pipe } from 'fp-ts/lib/function'

type Converter = {
  fromBinaryStringToDecimal: (input: string) => number
}

export const converter: Converter = {
  fromBinaryStringToDecimal: function (input: string): number {
    return pipe(
      input,
      n => parseInt(n, 2),
      n => parseInt(n.toString(), 10)
    )
  },
}
