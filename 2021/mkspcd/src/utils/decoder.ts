import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'
import { Command, Matrix, Measurement } from '../types'
import { utils } from '.'

type Decoder = {
  toCommands: (input: string[]) => Command[]
  toDiagnosticReport: (input: string[]) => Matrix
  toMeasurements: (input: string[]) => Measurement[]
}

export const decoder: Decoder = {
  toCommands: function (input: string[]): Command[] {
    return pipe(
      input,
      A.map(S.split(' ')),
      A.map(
        d => ({ direction: d[0], distance: Number(d[1]) }) as Command,
      ),
    )
  },
  
  toDiagnosticReport: function (input: string[]): Matrix {
     return pipe(
      input,
      x => x.map(arr => arr.split('')),
      x => x.map(arr => arr.map(Number)),
    )
  },

  toMeasurements: function (input: string[]): Measurement[] {
    return pipe(
      input,
      A.map(utils.parseStringToNumber),
    )
  },
}
