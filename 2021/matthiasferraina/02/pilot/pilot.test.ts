import { assertNotEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { assertEquals } from "../../deps-dev.ts";
import { Command, formatMove, pilot } from "./pilot.ts";

Deno.test("pilot", async (t) => {
  await t.step("Given a list of all commands", async (t) => {
    await t.step("When the Command.DOWN equals Command.DOWN", async (t) => {
      const commands: [Command, string][] = [
        [Command.FORWARD, "4"],
        [Command.DOWN, "4"],
        [Command.UP, "4"],
      ];
      await t.step("Then the pilot command should return 0", () => {
        const expectedHorizontalPosition = 0;
        assertEquals(pilot(commands), expectedHorizontalPosition);
      });
    });
    await t.step("When the Command.FORWARD equals 0", async (t) => {
      const commands: [Command, string][] = [
        [Command.FORWARD, "0"],
        [Command.DOWN, "4"],
        [Command.UP, "4"],
      ];
      await t.step("Then the pilot command should return 0", () => {
        const expectedHorizontalPosition = 0;
        assertEquals(pilot(commands), expectedHorizontalPosition);
      });
    });
    await t.step("When all commands are different", async (t) => {
      const commands: [Command, string][] = [
        [Command.FORWARD, "2"],
        [Command.DOWN, "4"],
        [Command.UP, "1"],
      ];
      await t.step("Then the pilot command should not return 0", () => {
        assertNotEquals(pilot(commands), 0);
      });
      await t.step("Then the pilot command should return 6", () => {
        const expectedHorizontalPosition = 6;
        assertEquals(pilot(commands), expectedHorizontalPosition);
      });
    });
  });
});

Deno.test("formatMove", async (t) => {
  await t.step("Given a string moveQuantity", async (t) => {
    await t.step("When the moveQuantity is '0'", async (t) => {
      await t.step("Then the returned value should be 0", () => {
        const expectedValue = 0;
        assertEquals(formatMove("0"), expectedValue);
      });
    });
    await t.step("When the moveQuantity is '5'", async (t) => {
      await t.step("Then the returned value should be 5", () => {
        const expectedValue = 5;
        assertEquals(formatMove("5"), expectedValue);
      });
    });
  });
});
