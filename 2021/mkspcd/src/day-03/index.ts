import path from 'path'
import { FileName, Matrix } from '../types'
import {  converter, decoder, matrix, reader } from '../utils'
import { pipe } from 'fp-ts/lib/function'

const INPUT_FILE: FileName = path.join(__dirname, 'input.txt')

const data: Matrix = pipe(
  INPUT_FILE,
  reader.fromFile,
  decoder.toDiagnosticReport,
)

export function getGammaRate(data: Matrix): number {
  return pipe(
    data,
    matrix.getMostCommonBitOnEachColumn,
    arr => arr.join(''),
    converter.fromBinaryStringToDecimal,
  )
}

export function getEpsilonRate(data: Matrix): number {
  return pipe(
    data,
    matrix.getLeastCommonBitOnEachColumn,
    arr => arr.join(''),
    converter.fromBinaryStringToDecimal,
  )
}

export function run03(): void {
  console.log('Part one = Gamma Rate::', getGammaRate(data))
  console.log('Part one = Epsilon Rate::', getEpsilonRate(data))
  console.log('Part one = Power consumption of the submarine::', getGammaRate(data) * getEpsilonRate(data))
}
