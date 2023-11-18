export type FileName = string

export type Measurement = number

export type Direction = 'forward' | 'up' | 'down'

export type Command = {
  direction: Direction,
  distance: number,
}

export type Position = {
  horizontal: number,
  depth: number,
}

export type Matrix = number[][]
