import path from 'path'
import { FileName, Measurement } from '../types'
import { decoder, reader } from '../utils'
import { pipe } from 'fp-ts/lib/function'

const INPUT_FILE: FileName = path.join(__dirname, 'input.txt')

const measurements: Measurement[] = pipe(
  INPUT_FILE,
  reader.fromFile,
  decoder.toMeasurements,
)

function largerMeasurements(measurements: Measurement[]): number {
  let count = 0
  
  for (let i = 1; i < measurements.length; i++)
    if (measurements[i] > measurements[i - 1]) count++
  
  return count
}

function slidingLargerMeasurements(measurements: Measurement[]): number {
  let slidingMeasurements: Measurement[] = []

  for (let i = 2; i < measurements.length; i++)
    slidingMeasurements.push(measurements[i] + measurements[i - 1] + measurements[i - 2])

  return largerMeasurements(slidingMeasurements)
}

export function run01(): void {
  console.log('Larger Measurements::', largerMeasurements(measurements))
  console.log('Sliding Larger Measurements::', slidingLargerMeasurements(measurements))
}
