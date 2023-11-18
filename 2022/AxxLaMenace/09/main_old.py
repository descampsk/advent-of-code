from os.path import join, dirname

direction_dict = {
    'R':(1,0),
    'L':(-1,0),
    'U':(0,1),
    'D':(0,-1),
}

def get_adjacents(node):
    return [[sum(x) for x in zip(node, (dx,dy))] for dy in [-1,0,1] for dx in [-1,0,1]]

def dist(a, b):
    return (a[0]-b[0])**2 + (a[1]-b[1])**2

def move_head(head, direction):
    return [sum(x) for x in zip(head, direction_dict[direction])]

def move_tail(head, tail):
    def dist2(u): return dist(u, head)
    if dist(head, tail) > 2:
        tail = min(get_adjacents(tail), key=dist2)
    return tail

def solve(data, rope_length):
    nodes = [(0,0)]*rope_length
    visited = {nodes[-1]}
    for (direction, n) in data:
        for i in range(int(n)):
            nodes[0] = move_head(nodes[0], direction)
            for k in range(rope_length-1):
                nodes[k+1] = move_tail(nodes[k], nodes[k+1])
            visited.add(tuple(nodes[-1]))
    return len(visited)
            
with open(join(dirname(__file__), 'data.txt')) as f:
    data = [row.split(' ')for row in f.read().splitlines()]

print(solve(data, 2))
print(solve(data, 10))
