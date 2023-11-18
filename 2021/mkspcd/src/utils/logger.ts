type Logger = {
  inPipe: <T>(input: T) => T
}

export const logger: Logger = {
  inPipe: function <T>(input: T): T {
    console.log(input)
    return input
  },
}
