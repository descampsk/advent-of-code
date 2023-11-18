from os.path import join, dirname
import re

def manhattan_dist(x1, y1, x2, y2):
    return abs(x2-x1) + abs(y2-y1)

def init_sensors_and_beacons(data):
    sensors = {}
    beacons = set()
    for a, b, c, d in data:
        sensors[(a, b)] = manhattan_dist(a, b, c, d)
        beacons.add((c, d))
    return sensors, beacons

def get_positions(x_sensor, y_sensor, dist, y_line):
    horizontal_dist = dist - abs(y_sensor - y_line)
    if horizontal_dist < 0:
        return []
    return [(x, y_line) for x in range(x_sensor-horizontal_dist, x_sensor+horizontal_dist+1)]

def get_positions_for_line(sensors, beacons, y_line):
    positions = set()
    for (x_sensor, y_sensor), dist in sensors.items():
        positions.update(get_positions(x_sensor, y_sensor, dist, y_line))
    positions -= beacons
    return positions

def get_segments(x_sensor, y_sensor, dist, y_line, limit=None):
    horizontal_dist = dist - abs(y_sensor - y_line)
    if horizontal_dist < 0:
        return []
    if limit:
        return [(max(0, x_sensor-horizontal_dist), min(limit, x_sensor+horizontal_dist+1))]
    return [(x_sensor-horizontal_dist, x_sensor+horizontal_dist+1)]

def merge_segments(segments):
    segments.sort(key=lambda x:x[0])
    while len(segments) > 1:
        a, b = segments[0]
        c, d = segments[1]
        if c > b:
            break
        segments[0] = (a, max(b, d))
        del segments[1]
    return segments[0][1] - segments[0][0]

def get_unique_position_for_line(sensors, y_line, limit):
    segments = []
    for (x_sensor, y_sensor), dist in sensors.items():
        segments += get_segments(x_sensor, y_sensor, dist, y_line, limit)
    return merge_segments(segments)

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [list(map(int, re.findall('-?\d+', line))) for line in f.read().splitlines()]

sensors, beacons = init_sensors_and_beacons(data)
TEST = False

if TEST:
    LIMIT = 20
    print('TEST', len(get_positions_for_line(sensors, beacons, 10)))
else:
    LIMIT = 4_000_000
    print('PART_1', len(get_positions_for_line(sensors, beacons, 2_000_000)))

    frequency = None
    for y_line in range(2658764, LIMIT):
        unique_position = get_unique_position_for_line(sensors, y_line, LIMIT)
        if unique_position != LIMIT:
            frequency = 4_000_000 * unique_position + y_line
            break
    print('PART_2', frequency)




