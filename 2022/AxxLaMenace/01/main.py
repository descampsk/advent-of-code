from os.path import join, dirname

with open(join(dirname(__file__), 'data.txt')) as f:
    data = sorted([sum(map(int, elem_list.split('\n'))) for elem_list in f.read().split('\n\n')], reverse=True)
print('PART_1', data[0])
print('PART_2', sum(data[:3]))
