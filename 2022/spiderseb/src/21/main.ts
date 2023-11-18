import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Values = Record<string, number>;
type Operation = {
  key: string;
  operator1: string;
  operator2: string;
  operand: "+" | "-" | "/" | "*";
};
const parseInputs = (lines: string[]): [Operation[], Values] => {
  const values: Values = {};
  const operations: Operation[] = [];
  lines.forEach((line) => {
    const value = line.match(/([a-z]+): ([0-9]+)/);
    if (value?.[2]) {
      values[value[1]] = Number(value?.[2]);
    } else {
      // eslint-disable-next-line no-useless-escape
      const operation = line.match(/([a-z]+)\: ([a-z]+) ([+*-/]) ([a-z]+)/);
      if (operation?.[4]) {
        operations.push({
          key: operation[1],
          operator1: operation[2],
          operator2: operation[4],
          operand: operation[3] as "+" | "-" | "/" | "*",
        });
      } else {
        throw new Error(`Cannot parse input line ${line}`);
      }
    }
  });
  return [operations, values];
};

const executeOperation = (operation: Operation, values: Values): number => {
  switch (operation.operand) {
    case "+":
      return values[operation.operator1] + values[operation.operator2];
    case "-":
      return values[operation.operator1] - values[operation.operator2];
    case "*":
      return values[operation.operator1] * values[operation.operator2];
    case "/":
      return values[operation.operator1] / values[operation.operator2];
    default:
      throw new Error(`Unknown operator ${operation.operand}`);
  }
};

const executeReverseOperation = (
  operation: Operation,
  values: Values
): number => {
  switch (operation.operand) {
    case "+": {
      // 1 = 2 + a => a = 1 - 2
      // 1 = a + 2 => a = 1 - 2
      const reverseOperation: Operation = {
        key:
          operation.operator1 in values
            ? operation.operator2
            : operation.operator1,
        operator1: operation.key,
        operator2:
          operation.operator1 in values
            ? operation.operator1
            : operation.operator2,
        operand: "-",
      };
      return executeOperation(reverseOperation, values);
    }
    case "*": {
      // 1 = 2 * a => a = 1/2
      // 1 = a * 2 => a = 1/2
      const reverseOperation: Operation = {
        key:
          operation.operator1 in values
            ? operation.operator2
            : operation.operator1,
        operator1: operation.key,
        operator2:
          operation.operator1 in values
            ? operation.operator1
            : operation.operator2,
        operand: "/",
      };
      return executeOperation(reverseOperation, values);
    }
    case "-": {
      // 1 = 2 - a => a = 2 - 1
      // 1 = a - 2 => a = 1 + 2
      const reverseOperation: Operation = {
        key:
          operation.operator1 in values
            ? operation.operator2
            : operation.operator1,
        operator1:
          operation.operator1 in values ? operation.operator1 : operation.key,
        operator2:
          operation.operator1 in values ? operation.key : operation.operator2,
        operand: operation.operator1 in values ? "-" : "+",
      };
      return executeOperation(reverseOperation, values);
    }
    case "/": {
      // 1 = 2 / a => a = 2/1
      // 1 = a / 2 => a = 1*2
      const reverseOperation: Operation = {
        key:
          operation.operator1 in values
            ? operation.operator2
            : operation.operator1,
        operator1:
          operation.operator1 in values ? operation.operator1 : operation.key,
        operator2:
          operation.operator1 in values ? operation.key : operation.operator2,
        operand: operation.operator1 in values ? "/" : "*",
      };
      return executeOperation(reverseOperation, values);
    }
    default:
      throw new Error(`Unknown operator ${operation.operand}`);
  }
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [operations, values] = parseInputs(lines);
  while (operations.length) {
    const solvableOperationIndex = operations.findIndex(
      (operation) =>
        operation.operator1 in values && operation.operator2 in values
    );
    if (solvableOperationIndex === -1) {
      throw new Error("Cannot find a solvable operation");
    }
    const operation = operations.splice(solvableOperationIndex, 1)[0];
    values[operation.key] = executeOperation(operation, values);
    if (operation.key === "root") return values[operation.key];
  }
  return 0;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [operations, values] = parseInputs(lines);
  if (values.humn) delete values.humn;

  // First, compute all solvable values
  while (operations.length) {
    const solvableOperationIndex = operations.findIndex(
      (operation) =>
        operation.key !== "humn" &&
        operation.operator1 in values &&
        operation.operator2 in values
    );
    if (solvableOperationIndex === -1) {
      break;
    }
    const operation = operations.splice(solvableOperationIndex, 1)[0];
    values[operation.key] = executeOperation(operation, values);
  }

  // Then, Process root equality
  {
    const rootOperatioIndex = operations.findIndex(
      (operation) => operation.key === "root"
    );
    const operation = operations.splice(rootOperatioIndex, 1)[0];
    if (operation.operator1 in values) {
      values[operation.operator2] = values[operation.operator1];
    } else if (operation.operator2 in values) {
      values[operation.operator1] = values[operation.operator2];
    } else {
      throw new Error("cannot solve without 1 part of root solved");
    }
  }

  // Finaly compute all solvable reversed operations
  while (operations.length) {
    const solvableOperationIndex = operations.findIndex(
      (operation) =>
        operation.key in values &&
        (operation.operator1 in values || operation.operator2 in values)
    );
    if (solvableOperationIndex === -1) {
      throw new Error("Cannot find a solvable operation");
    }
    const operation = operations.splice(solvableOperationIndex, 1)[0];
    const key =
      operation.operator1 in values ? operation.operator2 : operation.operator1;
    values[key] = executeReverseOperation(operation, values);
    if (key === "humn") return values[key];
  }

  return 0;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test); // 152
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1); // 104272990112064

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test); // 301
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2); // 3220993874133
};

main().catch((error) => console.error(error));
