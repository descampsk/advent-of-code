def create_graph_dict(data):
    d = {}
    for link in data:
        for i in range(len(link)):
            if link[1-i] != 'start':
                d[link[i]] = [link[1-i]] if link[i] not in d else d[link[i]] + [link[1-i]]
    return d

def are_conditions_fulfilled(node, current_path, allow_double_visit, puzzle=1):
    if node not in current_path or node.isupper():
        return True, allow_double_visit
    elif puzzle==2 and node.islower() and allow_double_visit:
        return True, False
    return False, allow_double_visit

def find_paths(graph_dict, current_node, current_path, paths_list, allow_double_visit, puzzle=1):
    if current_node == 'end':
        paths_list.append(current_path)
    else:
        for node in graph_dict[current_node]:
            current_path_copy = current_path[:]
            conditions, allow_double_visit2 = are_conditions_fulfilled(node, current_path_copy, allow_double_visit, puzzle)
            if conditions:
                current_path_copy.append(node)
                paths_list = find_paths(graph_dict, node, current_path_copy, paths_list, allow_double_visit2, puzzle)
    return paths_list

def solve_puzzle(data, puzzle):
    graph_dict = create_graph_dict(data)
    paths = find_paths(graph_dict, 'start', ['start'], [], True, puzzle)
    return len(paths)

if __name__ == '__main__':
    with open("12/data.txt") as f:
        data = [line.strip().split('-') for line in f]
        print("result first puzzle:", solve_puzzle(data, puzzle=1))
        print("result second puzzle:", solve_puzzle(data, puzzle=2))
