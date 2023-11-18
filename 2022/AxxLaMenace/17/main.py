from os.path import join, dirname

block_draw = [  # from bottom to top
    ['####'],  # horizontal line -
    ['.#.', '###', '.#.'],  # plus sign +
    ['###', '..#', '..#'],  # reverse L
    ['#', '#', '#', '#'],  # vertical stick |
    ['##', '##']  # square
]
block_tuples = [[(y, x) for x in range(len(block[0])) for y in range(
    len(block)) if block[y][x] == '#'] for block in block_draw]


def empty_line():
    return ['.' for _ in range(7)]


class Block:
    def __init__(self, x, y, type):
        self.x: int = x
        self.y = y
        self.tup = block_tuples[type % len(block_tuples)]
        self.draw = block_draw[type % len(block_draw)]
        self.width = len(self.draw[0])
        self.height = len(self.draw)
        self.is_mobile = True


def display_intermediate(matrix, block):
    newMatrix = [row[:] for row in matrix]
    update_matrix(newMatrix, block)
    display(newMatrix)


def update_matrix(matrix, block: Block):
    for (y, x) in block.tup:
        i = block.y + y
        j = block.x + x
        matrix[i][j] = '#'


def display(matrix):
    for row in matrix[::-1]:
        print(''.join(row))


class Grid:
    def __init__(self, size: int = 3):
        self.mat = [empty_line() for _ in range(size)]
        self.width = 7
        self.stock = {}

    def add_line(self):
        self.mat.append(empty_line())

    def is_empty_x(self, block: Block, wind_x: int):
        for (y, x) in block.tup:
            i = block.y + y
            j = block.x + x + wind_x
            if j < 0 or j >= self.width or self.mat[i][j] == '#':
                return False
        return True

    def is_empty_y(self, block: Block):
        for (y, x) in block.tup:
            i = block.y + y - 1
            j = block.x + x
            if i < 0 or self.mat[i][j] == '#':
                return False
        return True

    def step(self, block: Block, wind: str):
        wind_x = {'>': 1, '<': -1}[wind]
        if self.is_empty_x(block, wind_x):
            block.x += wind_x
        if self.is_empty_y(block):
            block.y -= 1
        else:
            block.is_mobile = False

    def move_one_block(self, block: Block, winds: str, wind_index: int, max_height: int):
        while block.is_mobile:
            self.step(block, winds[wind_index % len(winds)])
            wind_index += 1
        update_matrix(self.mat, block)
        max_height = max(max_height, block.y + block.height)
        return wind_index, max_height

    def move(self, winds: str, blocks_left:int, max_height: int = 0, block_index=0, wind_index=0, pattern_length=None, stock={}):
        num_block = 0
        height_to_add = 0
        while blocks_left > 0:
            block = Block(2, max_height + 3, block_index)
            while block.y + block.height > len(self.mat)-1:
                self.add_line()
            wind_index, max_height = self.move_one_block(block, winds, wind_index, max_height)
            block_index += 1
            blocks_left -= 1
            num_block += 1

            if pattern_length and max_height > pattern_length:
                motif = ''.join(''.join([c for c in row]) for row in self.mat[max_height-pattern_length: max_height])
                if motif in self.stock:
                    old_num_block, old_max_height = self.stock[motif]
                    delta_block = num_block - old_num_block
                    delta_height = max_height - old_max_height
                    patterns = blocks_left // delta_block
                    # print('YOUHOU delta_block, delta_height, patterns', delta_block, delta_height, patterns)
                    blocks_left -= patterns * delta_block
                    pattern_length = None
                    height_to_add = patterns * delta_height
                else:
                    self.stock[motif] = (num_block, max_height)
        return max_height + height_to_add

def solve(winds, blocks_left, pattern_length=None):
    g = Grid()
    max_height = g.move(winds, blocks_left, pattern_length=pattern_length)
    return max_height

with open(join(dirname(__file__), 'data.txt')) as f:
    winds = f.read()

print('PART_1', solve(winds, 2022))
print('PART_2', solve(winds, 1_000_000_000_000, pattern_length=2737))
