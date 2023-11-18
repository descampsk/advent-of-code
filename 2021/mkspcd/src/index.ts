import { run01 } from './day-01'
import { run02 } from './day-02'
import { run03 } from './day-03'

type Solutions = {
  1: () => void
  2: () => void
  3: () => void
}

const solutions: Solutions = {
  1: run01,
  2: run02,
  3: run03,
}

function run(puzzle: keyof Solutions) {
  return solutions[puzzle]()
}

run(3)
