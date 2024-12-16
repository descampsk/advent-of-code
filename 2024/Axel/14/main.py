from os.path import join, dirname
import re


def move(x, y, vx, vy, Xmax, Ymax, t):
    return ((x + vx * t) % Xmax, (y + vy * t) % Ymax)


def part_1(data, Xmax, Ymax):
    time = 100
    positions = [move(*robot, Xmax, Ymax, time) for robot in data]
    q1 = sum(1 for x, y in positions if x < Xmax // 2 and y < Ymax // 2)
    q2 = sum(1 for x, y in positions if x > Xmax // 2 and y < Ymax // 2)
    q3 = sum(1 for x, y in positions if x < Xmax // 2 and y > Ymax // 2)
    q4 = sum(1 for x, y in positions if x > Xmax // 2 and y > Ymax // 2)
    return q1 * q2 * q3 * q4


def display(positions, Xmax, Ymax):
    for y in range(Ymax):
        for x in range(Xmax):
            print(
                "|" if x == Xmax // 2 else "#" if (x, y) in positions else " ", end=""
            )
        print()


def part_2(data, Xmax, Ymax):
    max_sym = 0
    max_index = -1
    for time in range(101 * 103):
        positions = set([move(*robot, Xmax, Ymax, time) for robot in data])
        sym = sum((Xmax - 1 - x, y) in positions for x, y in positions)
        new_val = int(sym / len(positions) * 100)
        if new_val > max_sym:
            max_sym = new_val
            max_index = time
    good_positions = set([move(*robot, Xmax, Ymax, max_index) for robot in data])
    display(good_positions, Xmax, Ymax)

    print(f"max_sym = {max_sym}%", "max_index", max_index)
    return max_index


def part_2_test(data, Xmax, Ymax):
    for time in range(101 * 103):
        positions = [move(*robot, Xmax, Ymax, time) for robot in data]
        if len(positions) == len(set(positions)):
            print(time)


with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, re.findall(r"-?\d+", row))) for row in f.read().splitlines()]

Xmax, Ymax = 101, 103

# print("part_1", part_1(data, Xmax, Ymax))
# print(part_2(data, Xmax, Ymax))
part_2_test(data, Xmax, Ymax)


## DISPLAY CURSE


# import curses
# import time


# def report_progress(filename, progress):
#     """progress: 0-10"""
#     stdscr.addstr(0, 0, "Moving file: {0}".format(filename))
#     stdscr.addstr(
#         1, 0, "Total progress: [{1:10}] {0}%".format(progress * 10, "#" * progress)
#     )
#     stdscr.refresh()


# if __name__ == "__main__":
#     stdscr = curses.initscr()
#     curses.noecho()
#     curses.cbreak()

#     try:
#         for i in range(10):
#             report_progress("file_{0}.txt".format(i), i + 1)
#             time.sleep(0.5)
#     finally:
#         curses.echo()
#         curses.nocbreak()
#         curses.endwin()
