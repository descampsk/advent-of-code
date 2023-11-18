/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { flow, min } from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

type Valve = {
  id: string;
  rate: number;
  open: boolean;
  tunnels: string[];
};

const getValves = (lines: string[]) => {
  const valves: Record<string, Valve> = {};
  lines.forEach((line) => {
    const valveIds = line.match(/[A-Z][A-Z]/g) ?? [];
    const id = valveIds[0];
    const tunnels = valveIds.slice(1);
    // @ts-expect-error Should not be null
    const flowStr = line.match(/rate=[0-9]./)[0].split("=")[1];
    const rate = parseInt(flowStr, 10);
    valves[id] = {
      id,
      rate,
      open: false,
      tunnels,
    };
  });
  return valves;
};

type State = {
  flow: number;
  total: number;
  opened: Set<string>;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const valves = getValves(lines);

  const states: Record<number, Record<string, Record<string, State>>> = {};
  let concurentPositions: Set<string> = new Set<string>().add("AA");
  const totalMinutes = 30;
  for (let i = 0; i <= totalMinutes; i++) {
    states[i] = {};
    Object.keys(valves).forEach((key) => {
      states[i][key] = {};
    });
  }
  states[0].AA[""] = {
    flow: 0,
    total: 0,
    opened: new Set(),
  };
  let minutes = 0;

  let maxPressure = 0;

  while (minutes < totalMinutes) {
    minutes += 1;
    const nextPositions: string[] = [];
    for (const position of concurentPositions) {
      const valve = valves[position];
      const statesPerOpened = states[minutes - 1][position];
      Object.values(statesPerOpened).forEach((state) => {
        const openedStr = Array.from(state.opened).sort().join("-");
        // if (state.opened.size === 6) {
        //   nextPositions.push(position);
        //   const total = state.total + state.flow;
        //   states[minutes][position][openedStr] = {
        //     total,
        //     opened: state.opened,
        //     flow: state.flow,
        //   };
        //   if (total > maxPressure) maxPressure = total;
        // }

        if (!state.opened.has(position) && valve.rate > 0) {
          const existingState = states[minutes][position][openedStr];
          if (!existingState || existingState.flow <= state.flow) {
            const total = _.max([
              existingState?.total,
              state.total + state.flow,
            ])!;
            const opened = new Set(state.opened).add(position);
            const newOpenedStr = Array.from(opened).sort().join("-");
            states[minutes][position][newOpenedStr] = {
              total,
              opened: new Set(state.opened).add(position),
              flow: state.flow + valve.rate,
            };
            nextPositions.push(position);
            if (total > maxPressure) maxPressure = total;
          }
        }
        for (const tunnel of valve.tunnels) {
          const existingState = states[minutes][tunnel][openedStr];
          const total = _.max([
            existingState?.total,
            state.total + state.flow,
          ])!;
          if (
            (!existingState || existingState.flow <= state.flow) &&
            (state.total < 50 || 2 * state.total > maxPressure)
          ) {
            nextPositions.push(tunnel);
            states[minutes][tunnel][openedStr] = {
              total,
              opened: state.opened,
              flow: state.flow,
            };
            if (total > maxPressure) maxPressure = total;
          }
        }
      });
    }
    concurentPositions = new Set(nextPositions);
  }

  //   console.log(states[totalMinutes]);

  return maxPressure;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const valves = getValves(lines);

  const states: Record<number, Record<string, Record<string, State>>> = {};
  let concurentPositions: Set<string> = new Set<string>().add("AA-AA");
  const totalMinutes = 1;
  for (let i = 0; i <= totalMinutes; i++) {
    states[i] = {};
    Object.keys(valves).forEach((me) => {
      Object.keys(valves).forEach((elephant) => {
        const key = [me, elephant].sort().join("-");
        states[i][key] = {};
      });
    });
  }
  states[0]["AA-AA"][""] = {
    flow: 0,
    total: 0,
    opened: new Set(),
  };
  let minutes = 0;

  let maxPressure = 0;

  while (minutes < totalMinutes) {
    minutes += 1;
    const nextPositions: string[] = [];
    for (const position of concurentPositions) {
      const statesPerOpened = states[minutes - 1][position];
      Object.values(statesPerOpened).forEach((state) => {
        const openedStr = Array.from(state.opened).sort().join("-");
        const [mine, elephant] = position.split("-");
        const isMineVanneOk =
          !state.opened.has(mine) &&
          valves[mine].rate > 0 &&
          (!states[minutes][position][openedStr] ||
            states[minutes][position][openedStr].flow <= state.flow);
        const isElephantVanneOk =
          !state.opened.has(elephant) &&
          valves[elephant].rate > 0 &&
          (!states[minutes][position][openedStr] ||
            states[minutes][position][openedStr].flow <= state.flow);

        if (isElephantVanneOk && isMineVanneOk) {
          const opened = new Set(state.opened).add(mine).add(elephant);
          const existingState = states[minutes][position][openedStr];
          const total = _.max([
            existingState?.total,
            state.total + state.flow,
          ])!;
          const newOpenedStr = Array.from(opened).sort().join("-");
          states[minutes][position][newOpenedStr] = {
            total,
            opened,
            flow: state.flow + valves[mine].rate + valves[elephant].rate,
          };
          nextPositions.push(position);
          if (total > maxPressure) maxPressure = total;
        } else if (isElephantVanneOk) {
          const opened = new Set(state.opened).add(elephant);
          const existingState = states[minutes][position][openedStr];
          const total = _.max([
            existingState?.total,
            state.total + state.flow,
          ])!;
          const newOpenedStr = Array.from(opened).sort().join("-");
          states[minutes][position][newOpenedStr] = {
            total,
            opened,
            flow: state.flow + valves[mine].rate + valves[elephant].rate,
          };
          nextPositions.push(position);
          if (total > maxPressure) maxPressure = total;
        }

        // TODO open vannes
        // const actions = [vanne vanne], [move, vanne], [vanne, move], [move, move]

        // const valve = valves[position];
        // if (!state.opened.has(position) && valve.rate > 0) {
        //   const existingState = states[minutes][doublePosition][openedStr];
        //   if (!existingState || existingState.flow <= state.flow) {

        //   }
        // }
        for (const elephantTunnel of valves[elephant].tunnels) {
          for (const mineTunnel of valves[mine].tunnels) {
            const newPosition = [elephantTunnel, mineTunnel].sort().join("-");
            const existingState = states[minutes][newPosition][openedStr];
            const total = _.max([
              existingState?.total,
              state.total + state.flow,
            ])!;
            if (
              (!existingState || existingState.flow <= state.flow) &&
              (state.total < 50 || 2 * state.total > maxPressure)
            ) {
              nextPositions.push(newPosition);
              states[minutes][newPosition][openedStr] = {
                total,
                opened: state.opened,
                flow: state.flow,
              };
              if (total > maxPressure) maxPressure = total;
            }
          }
        }
      });
    }
    concurentPositions = new Set(nextPositions);
  }

  console.log(states[totalMinutes]);

  return maxPressure;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
