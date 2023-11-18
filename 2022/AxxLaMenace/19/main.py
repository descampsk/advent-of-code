from os.path import join, dirname
from collections import deque
import re

def find_best_geodes(blueprint, start_time = 24):
    num, ore_ore, clay_ore, obs_ore, obs_clay, geo_ore, geo_obs = blueprint
    stack = deque([(start_time, 1, 0, 0, 0, 0, 0, 0, 0)])
    best_geodes = 0
    visited = set()
    max_ore = max(ore_ore, clay_ore, obs_ore, geo_ore)
    while stack:
        state = stack.popleft()
        time, ore_rob, clay_rob, obs_rob, geo_rob, ore, clay, obs, geo = state
        if time == 0:
            best_geodes = max(geo, best_geodes)
            continue

        # limit with max resource we can spend until end
        ore = min(ore, time * max_ore - ore_rob * (time - 1))
        clay = min(clay, time * obs_clay - clay_rob * (time - 1))
        obs = min(obs, time * geo_obs - obs_rob * (time - 1))

        if state in visited:
            continue
        visited.add(state)
        if ore >= geo_ore and obs >= geo_obs:
            # build geode robot
            stack.append((time-1, ore_rob, clay_rob, obs_rob, geo_rob+1, ore+ore_rob-geo_ore, clay+clay_rob, obs+obs_rob-geo_obs, geo+geo_rob))
            continue

        # wait and harvest resources
        stack.append((time-1, ore_rob, clay_rob, obs_rob, geo_rob, ore+ore_rob, clay+clay_rob, obs+obs_rob, geo+geo_rob))

        # build obsidian robot
        if ore >= obs_ore and clay >= obs_clay and obs_rob < geo_obs:
            stack.append((time-1, ore_rob, clay_rob, obs_rob+1, geo_rob, ore+ore_rob-obs_ore, clay+clay_rob-obs_clay, obs+obs_rob, geo+geo_rob))
            continue

        # build clay robot
        if ore >= clay_ore and clay_rob < obs_clay:
            stack.append((time-1, ore_rob, clay_rob+1, obs_rob, geo_rob, ore+ore_rob-clay_ore, clay+clay_rob, obs+obs_rob, geo+geo_rob))

        # build ore robot
        if ore >= ore_ore and ore_rob < max_ore:
            stack.append((time-1, ore_rob+1, clay_rob, obs_rob, geo_rob, ore+ore_rob-ore_ore, clay+clay_rob, obs+obs_rob, geo+geo_rob))

    return num, best_geodes

def solve(data, start_time = 24, puzzle = 1):
    total_qualities = 0
    product_geodes = 1
    for blueprint in data:
        num, best_geodes = find_best_geodes(blueprint, start_time)
        total_qualities += num * best_geodes
        product_geodes *= best_geodes
    return total_qualities if puzzle == 1 else product_geodes

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [list(map(int, re.findall(r'\d+', line))) for line in f.read().splitlines()]


print('PART_1', solve(data, 24))
print('PART_2', solve(data[:3], 32, puzzle=2))
