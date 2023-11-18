from collections import defaultdict

def find_nb_paths(graph_dict, current_node, visited, visit_twice):
    if current_node == 'end': return 1
    nb_paths = 0
    for node in graph_dict[current_node]:
        if node not in visited or node.isupper():
            nb_paths += find_nb_paths(graph_dict, node, visited | {node}, visit_twice)
        elif visit_twice:
            nb_paths += find_nb_paths(graph_dict, node, visited | {node}, False)
    return nb_paths

def solve_puzzle(data, visit_twice):
    graph_dict = defaultdict(list)
    for link in data:
        for i in range(len(link)):
            if link[1-i] != 'start':
                graph_dict[link[i]].append(link[1-i])
    return find_nb_paths(graph_dict, 'start', set(), visit_twice)

if __name__ == '__main__':
    with open("12/data.txt") as f:
        data = [line.strip().split('-') for line in f]
        print("result first puzzle:", solve_puzzle(data, False))
        print("result second puzzle:", solve_puzzle(data, True))
