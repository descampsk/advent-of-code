import path from 'path'
import { Command, FileName, Position } from '../types'
import { decoder, reader } from '../utils'
import { pipe } from 'fp-ts/lib/function'

const INPUT_FILE: FileName = path.join(__dirname, 'input.txt')

const commands: Command[] = pipe(
  INPUT_FILE,
  reader.fromFile,
  decoder.toCommands,
)

function finalPositionAndFinalDepth(commands: Command[]): Position {
  let depth = 0
  let horizontal = 0

  for (let i = 0; i < commands.length; i++) {
    if (commands[i].direction === 'forward') {
      horizontal += commands[i].distance
    } else if (commands[i].direction === 'up') {
      depth = depth - commands[i].distance
    } else if (commands[i].direction === 'down') {
      depth = depth + commands[i].distance
    }
  }

  return { horizontal, depth }
}

function finalPositionAndFinalDepthWithAim(commands: Command[]): Position {
  let aim = 0
  let depth = 0
  let horizontal = 0

  for (let i = 0; i < commands.length; i++) {
    if (commands[i].direction === 'forward') {
      horizontal += commands[i].distance
      depth = depth + aim * commands[i].distance
    } else if (commands[i].direction === 'up') {
      aim = aim - commands[i].distance
    } else if (commands[i].direction === 'down') {
      aim = aim + commands[i].distance
    }
  }

  return { horizontal, depth }
}

export function run02(): void {
  const resultPart1 = finalPositionAndFinalDepth(commands)
  const resultPart2 = finalPositionAndFinalDepthWithAim(commands)

  console.log('\nFinal Position And Final Depth::')
  console.log('\tHorizontal Position:', resultPart1.horizontal)
  console.log('\tDepth:', resultPart1.depth)
  console.log('\tThe product is:', resultPart1.depth * resultPart1.horizontal)

  console.log('\nFinal Position And Final Depth With Aim::')
  console.log('\tHorizontal Position:', resultPart2.horizontal)
  console.log('\tDepth:', resultPart2.depth)
  console.log('\tThe product is:', resultPart2.depth * resultPart2.horizontal)
}
