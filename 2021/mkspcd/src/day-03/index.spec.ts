import path from 'path'
import { FileName, Matrix } from '../types'
import { decoder, reader } from '../utils'
import { pipe } from 'fp-ts/lib/function'
import { getGammaRate } from '.'

const INPUT_FILE: FileName = path.join(__dirname, 'input.mock.txt')

const data: Matrix = pipe(
  INPUT_FILE,
  reader.fromFile,
  decoder.toDiagnosticReport,
)

describe('Puzzle day 03', () => {
  describe('getGammaRate', () => {
    it('get the gamma rate', () => {
      expect(getGammaRate(data)).toEqual(22)
    });
  });
})
