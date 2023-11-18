
from time import perf_counter
from math import inf
from functools import lru_cache
import heapq


class Node:

	deleted = -1
	unknown = 0
	closed = 1
	open = 2

	def __init__(self, pos):
		self.pos = pos
		self.status = Node.unknown
		self.previous = None
		self.cost = 0
		self.est_remaining_cost = 0

	def get_total_cost(self):
		return self.cost + self.est_remaining_cost

	def __lt__(self, other):
		return self.get_total_cost() < other.get_total_cost()

	def __repr__(self):
		return f"{self.pos} {self.cost} {self.get_total_cost()}"


class OpenList:
	def __init__(self):
		self.list = []

	def is_empty(self):
		return len(self.list) == 0

	def push(self, node):
		heapq.heappush(self.list, node)

	def pop(self):
		while len(self.list) > 0:
			node = heapq.heappop(self.list)
			if node.status != Node.deleted:
				return node
		return None


def read_file(name):
	file = open(name)
	return [line.strip() for line in file.readlines()]


def parse_puzzle(lines):
	# Returns a position as a string where the input maps to the following positions:
	#   #############
	#   #89ABCDEFGHI#
	#   ###1#3#5#7###
	#     #0#2#4#6#
	#     #########
	#
	# Thus the puzzle solution is:
	#   "AABBCCDD..........."
	return (lines[3][1] + lines[2][3] + lines[3][3] + lines[2][5] + lines[3][5] +
	        lines[2][7] + lines[3][7] + lines[2][9] + lines[1][1:-1])


def pretty_print(pos):
	# Prints a position in the format shown in the puzzle description. 
	print("#############")
	print(f"#{pos[8:]}#")
	print(f"###{pos[1]}#{pos[3]}#{pos[5]}#{pos[7]}###")
	print(f"  #{pos[0]}#{pos[2]}#{pos[4]}#{pos[6]}#")
	print("  #########")


def get_path(node):
	# Returns the path used to get to the given node.
	path = []
	while node != None:
		path.append((node.pos, node.cost))
		node = node.previous
	return list(reversed(path))


def find_path_astar(start, end):
	# Finds the path from start to end.
	nodes = {}
	open_list = OpenList()

	node = Node(start)
	node.status = Node.open
	nodes[start] = node
	open_list.push(node)

	while not open_list.is_empty():
		node = open_list.pop()
		if node is None:
			break
		nodes[node.pos].status = Node.closed

		if node.pos == end:
			return get_path(node), node.cost

		for next, next_cost in find_moves(node.pos):
			next_node = nodes.get(next, Node(next))
			if next_node.status == Node.closed:
				continue

			cost = node.cost + next_cost
			if next_node.status != Node.open:
				est_cost = h_cost(next_node.pos, end)
				next_node.cost = cost
				next_node.est_remaining_cost = est_cost
				next_node.previous = node
				next_node.status = Node.open
				nodes[next] = next_node
				open_list.push(next_node)
			elif cost < next_node.cost:
				updated_node = Node(next)
				updated_node.status = next_node.status
				updated_node.previous = node
				updated_node.cost = cost
				updated_node.est_remaining_cost = next_node.est_remaining_cost
				nodes[next] = updated_node
				next_node.status = Node.deleted
				open_list.push(updated_node)

	return None, inf


def h_cost(pos, target_pos):
	# Returns an estimated cost to get from pos to target_pos.
	cost = 0
	for pod in ['A', 'B', 'C', 'D']:
		cell1 = pos.index(pod)
		cell2 = pos[cell1 + 1:].index(pod) + cell1 + 1

		target1 = target_pos.index(pod)
		target2 = target_pos[target1 + 1:].index(pod) + target1 + 1

		cost1 = distance(cell1, target1) + distance(cell2, target2)
		cost2 = distance(cell2, target1) + distance(cell1, target2)
		cost += min(cost1, cost2) * energy[pod]
	return cost


@lru_cache(maxsize=None)
def distance(start_cell, end_cell):
	# Returns the manhattan distance between two cells.
	if start_cell == end_cell:
		return 0

	distance = 0
	start_room = start_cell // 2 if start_cell < 8 else None
	end_room = end_cell // 2 if end_cell < 8 else None

	if start_room is not None:
		if start_room == end_room:
			return abs(end_cell - start_cell)
		distance += 2 - (start_cell % 2)
		enter_hall_cell = start_room * 2 + 10
	else:
		enter_hall_cell = start_cell

	if end_room is not None:
		distance += 2 - (end_cell % 2)
		exit_hall_cell = end_room * 2 + 10
	else:
		exit_hall_cell = end_cell

	distance += abs(exit_hall_cell - enter_hall_cell)
	return distance


def find_moves(pos):
	# Returns a list of all valid moves from the given puzzle position.
	# The moves are sorted by cost in ascending order.
	moves = []
	for room in range(0, 4):
		for room_cell in range(0, 2):
			start_cell = room * 2 + room_cell
			pod = pos[start_cell]
			if pod == '.':
				continue

			cost_to_hall = cost_from_room_to_hall(pos, room, room_cell)
			if cost_to_hall is None:
				continue

			enter_hall_cell = room * 2 + 10
			find_moves_to_room(moves, pos, pod, start_cell, room, cost_to_hall,
			                   enter_hall_cell)
			find_moves_to_hall(moves, pos, pod, start_cell, cost_to_hall,
			                   enter_hall_cell)

	for start_cell in hall_cells:
		pod = pos[start_cell]
		if pod == '.':
			continue
		find_moves_to_room(moves, pos, pod, start_cell, None, 0, start_cell)

	return sorted(moves, key=lambda x: x[1])


def find_moves_to_room(moves, pos, pod, start_cell, start_room, cost_to_hall,
	                     enter_hall_cell):
	# Adds moves from the start_cell to each valid target room cell.
	for target_room in range(0, 4):
		if start_room == target_room:
			continue

		for target_room_cell in range(0, 2):
			target_cell = target_room * 2 + target_room_cell
			if not is_valid_room_target(pos, start_cell, target_cell):
				continue

			cost_from_hall = cost_from_hall_to_room(pos, target_room, target_room_cell)
			if cost_from_hall is None:
				continue

			exit_hall_cell = target_room * 2 + 10
			cost_in_hall = cost_from_hall_to_hall(pos, enter_hall_cell, exit_hall_cell)
			if cost_in_hall is None:
				continue

			cost = (cost_to_hall + cost_from_hall + cost_in_hall) * energy[pod]
			moves.append((make_move(pos, start_cell, target_cell), cost))


def find_moves_to_hall(moves, pos, pod, start_cell, cost_to_hall,
																							enter_hall_cell):
	# Adds moves from the start_cell to each valid target hall cell.
	for target_cell in hall_cells:
		cost_in_hall = cost_from_hall_to_hall(pos, enter_hall_cell, target_cell)
		if cost_in_hall is None:
			continue

		cost = (cost_to_hall + cost_in_hall) * energy[pod]
		moves.append((make_move(pos, start_cell, target_cell), cost))


def cost_from_room_to_hall(pos, room, room_cell):
	# Returns the cost of moving from a room to the hall entry way for the room
	# or None if the move is not valid.
	assert (room < 4)
	assert (room_cell < 2)
	cost = 1
	for cell in range(room_cell + 1, 2):
		if pos[room * 2 + cell] != '.':
			return None
		cost += 1
	return cost


def cost_from_hall_to_room(pos, room, room_cell):
	# Returns the cost of moving into a room or None if the move is not valid.
	# The starting point is the hall entry way to the room.
	assert (room < 4)
	assert (room_cell < 2)
	cost = 0
	for cell in range(1, room_cell - 1, -1):
		if pos[room * 2 + cell] != '.':
			return None
		cost += 1
	return cost


def cost_from_hall_to_hall(pos, start, target):
	# Returns the cost of moving from one hall cell to another hall cell
	# or None if the move is not valid.
	assert (start >= 8)
	assert (target >= 8)
	if start == target:
		return None
	cost = 0
	cell_range = range(start + 1, target + 1) if start < target else range(
		target, start)
	for cell in cell_range:
		if pos[cell] != '.':
			return None
		cost += 1
	return cost


def is_valid_room_target(pos, start, target):
	# Returns true if the target is a valid room cell for the pod in the start cell.
	assert (target < 8)
	pod = pos[start]
	target_room = target // 2
	pod_room = ord(pod) - ord('A')
	if target_room != pod_room:
		return False
	if pos[target_room * 2 + 1] != '.':
		return False
	if target == target_room * 2 + 1:
		return pos[target_room * 2] == pod
	return pos[target_room * 2] == '.'


def make_move(pos, cell, target):
	# Returns the position after moving cell to target.
	move = list(pos)
	move[cell] = '.'
	move[target] = pos[cell]
	return ''.join(move)


start_time = perf_counter()

# Valid hall stopping locations.
hall_cells = [8, 9, 11, 13, 15, 17, 18]

# Energy cost per move for each amphipod.
energy = {'A': 1, 'B': 10, 'C': 100, 'D': 1000}

# Puzzle solution.
end_pos = "AABBCCDD..........."

start_pos = parse_puzzle(read_file("23/data.txt"))
print('start_pos', start_pos)
path, cost = find_path_astar(start_pos, end_pos)
for pos, pos_cost in path:
	pretty_print(pos)
	print(f"cost = {pos_cost}")	
	print()

print(f"Part 1: {cost}")

duration = perf_counter() - start_time
print(f"Completed in {duration:.3f} seconds")