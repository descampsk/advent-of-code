/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const parseFile = (filename: string) =>
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), filename).replace(
      /\/dist\//g,
      "/src/",
    ),
    "utf-8",
  );

const inputTest = parseFile("input.test.txt");
const inputTest2 = parseFile("input2.test.txt");

const getComboOperandValue = (
  operand: number,
  registers: { A: number; B: number; C: number },
) => {
  if (operand <= 3) return operand;
  if (operand === 4) return registers.A;
  if (operand === 5) return registers.B;
  if (operand === 6) return registers.C;
  throw new Error("Invalid combo operand");
};

const executeInstruction = (
  registers: { A: number; B: number; C: number },
  program: number[],
) => {
  let instructionPointer = 0;
  const output: number[] = [];

  while (instructionPointer < program.length) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];

    switch (opcode) {
      case 0: // adv
        registers.A = Math.floor(
          registers.A / 2 ** getComboOperandValue(operand, registers),
        );
        break;
      case 1: // bxl
        registers.B ^= operand;
        break;
      case 2: // bst
        registers.B = getComboOperandValue(operand, registers) % 8;
        break;
      case 3: // jnz
        if (registers.A !== 0) {
          instructionPointer = operand;
          continue;
        }
        break;
      case 4: // bxc
        registers.B ^= registers.C;
        break;
      case 5: // out
        output.push(getComboOperandValue(operand, registers) % 8);
        break;
      case 6: // bdv
        registers.B = Math.floor(
          registers.A / 2 ** getComboOperandValue(operand, registers),
        );
        break;
      case 7: // cdv
        registers.C = Math.floor(
          registers.A / 2 ** getComboOperandValue(operand, registers),
        );
        break;
      default:
        throw new Error("Invalid opcode");
    }

    instructionPointer += 2;
  }

  return output.join(",");
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const registers = { A: 0, B: 0, C: 0 };
  let program: number[] = [];

  lines.forEach((line) => {
    if (line.startsWith("Register A:"))
      registers.A = parseInt(line.split(": ")[1]);
    if (line.startsWith("Register B:"))
      registers.B = parseInt(line.split(": ")[1]);
    if (line.startsWith("Register C:"))
      registers.C = parseInt(line.split(": ")[1]);
    if (line.startsWith("Program:"))
      program = line.split(": ")[1].split(",").map(Number);
  });

  return executeInstruction(registers, program);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const registers = { A: 0, B: 0, C: 0 };
  let program: number[] = [];

  lines.forEach((line) => {
    if (line.startsWith("Register A:"))
      registers.A = parseInt(line.split(": ")[1]);
    if (line.startsWith("Register B:"))
      registers.B = parseInt(line.split(": ")[1]);
    if (line.startsWith("Register C:"))
      registers.C = parseInt(line.split(": ")[1]);
    if (line.startsWith("Program:"))
      program = line.split(": ")[1].split(",").map(Number);
  });

  const targetOutput = program.join(",");

  for (let A = 1; ; A++) {
    const copyRegisters = { ...registers, A };
    const output = executeInstruction(copyRegisters, program);
    if (output === targetOutput) {
      return A;
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest2,
        expected: 117440,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
