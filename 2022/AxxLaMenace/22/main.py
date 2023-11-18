from os.path import join, dirname
import re

directions = ['RIGHT', 'DOWN', 'LEFT', 'UP']

def parse(grid_str, path_str):
    grid = [list(row) for row in grid_str.splitlines()]
    max_width = max(len(row) for row in grid)
    for idx in range(len(grid)):
        current_width = len(grid[idx])
        grid[idx] += [' ' for _ in range(max_width - current_width)]

    grid_t = [*zip(*grid)]

    path = re.findall(r'[A-Z]|\d+', path_str)
    start_col = next(i for i, v in enumerate(grid[0]) if v == '.')
    return grid, grid_t, path, start_col

def is_border(grid, position):
    i, j = position
    if i < 0 or i >= len(grid):
        return True
    if j < 0 or j >= len(grid[i]):
        return True
    if grid[i][j] == ' ':
        return True
    return False

def get_next_position(grid, grid_t, position, facing):
    i, j = position
    vectors = {
        'RIGHT': (0, 1),
        'LEFT': (0, -1),
        'UP': (-1, 0),
        'DOWN': (1, 0),
    }
    di, dj = vectors[facing]
    i1 = i + di
    j1 = j + dj
    if is_border(grid, (i1, j1)):
        i1, j1 = get_otherside(grid, grid_t, position, facing)
    if grid[i1][j1] == '.':
        return (i1, j1)
    elif grid[i1][j1] == '#':
        return (i, j)

def change_facing(facing, turn):
    index = directions.index(facing)
    new_index = index + 1 if turn == "R" else index - 1
    new_facing = directions[new_index%len(directions)]
    return new_facing

def move(grid, grid_t, path, facing, position):
    for idx, val in enumerate(path):
        # print('*********** NEW COMMAND', val)
        if idx%2 == 0:
            for _ in range(int(val)):
                position = get_next_position(grid, grid_t, position, facing)
                # print('position', position, facing)
        else:
            facing = change_facing(facing, val)
            # print('CHANGE FACING', facing)
    return position, facing

def get_otherside(grid, grid_t, position, facing):
    i, j = position
    i1, j1 = i, j
    if facing == 'RIGHT':
        j1 = next(k for k, v in enumerate(grid[i]) if v != ' ')
    elif facing == 'LEFT':
        j1 = next(c for c in range(len(grid[i])-1, -1, -1) if grid[i][c] != ' ')
    elif facing == 'DOWN':
        i1 = next(k for k, v in enumerate(grid_t[j]) if v != ' ')
    elif facing == 'UP':
        i1 = next(c for c in range(len(grid_t[j])-1, -1, -1) if grid_t[j][c] != ' ')
    return i1, j1

with open(join(dirname(__file__), 'data.txt')) as f:
    grid_str, path_str = f.read().split('\n\n')
grid, grid_t, path, start_col = parse(grid_str, path_str)

facing = 'RIGHT'
position = (0, start_col)
position, facing = move(grid, grid_t, path, facing, position)
total = 1000 * (position[0]+1) + 4 * (position[1]+1) + directions.index(facing)
print('total', total)
