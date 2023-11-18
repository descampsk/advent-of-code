import json
from math import floor, ceil

def add(a, b):
    return [a, b]

def magnitude(arr):
    if type(arr) != list:
        return arr
    else:
        a,b = arr
        return 3*magnitude(a) + 2*magnitude(b)


def explode(arr, depth=1, exploded=False, index_boum=-1, left=None, right=None, inverse_left=False, inverse_right=False):
    for index in range(2):
        if not exploded and type(arr[index]) == list: # search explosion
            if depth>=4:
                left, right = arr[index]
                arr[index] = 0
                exploded = True
                index_boum = index
            else:
                _, exploded, index_boum, left, right = explode(arr[index], depth+1, exploded, index_boum, left, right)
        if exploded:
            if right:
                if inverse_right:
                    pass
                else:
                    if index_boum==0:
                        if type(arr[1])!=list:
                            arr[1] += right
                        else:
                            _, exploded, index_boum, left, right = explode(arr[1], depth+1, exploded, index_boum, left, right, False, inverse_right=True)  



        break
    return arr, exploded, index_boum, left, right

def explode_old(arr, depth=1, exploded=False, left=None, right=None, inverse=False):
    for index, value in enumerate(arr):
        if not exploded and type(value) == list: # search explosion
            if depth>=4:
                left, right = value
                arr[index] = 0
                exploded = True
            else:
                _, exploded, left, right = explode(value, depth+1, exploded, left, right)
        if exploded:
            if inverse:
                if right:
                    if type(arr[0]) == list:
                        explode(arr[0], depth+1, exploded, left, right, True)
                    else:
                        print('INVERSE RIGHT', arr[index])
                        arr[0] += right
                        right = None
                if left:
                    if type(arr[1]) == list:
                        explode(arr[1], depth+1, exploded, left, right, True)
                    else:
                        print('INVERSE LEFT', arr[1])
                        arr[1] += left
                        left = None
            else:
                if right and index < len(arr)-1:
                    if type(arr[1]) == list:
                        # print('inversing right', arr[index+1])
                        _, exploded, left, right = explode(arr[index+1], depth+1, exploded, None, right, True)
                    else:                        
                        print('RIGHT', arr[index+1])
                        arr[index+1] += right
                        right = None
                if left and index>0:
                    if type(arr[index-1]) == list:
                        # print('inversing', arr[index-1])
                        _, exploded, left, right = explode(arr[index-1], depth+1, exploded, left, None, True)
                    else:                        
                        print('LEFT', arr[index-1])
                        arr[index-1] += left
                        left = None
            break
    return arr, exploded, left, right

def split(arr):
    result = False
    for index, value in enumerate(arr):
        if type(value) == list:
            result = split(value)
            if result:
                break
        elif value >= 10:
            # print('index', index, 'val', value)
            arr[index] = [floor(value/2), ceil(value/2)]
            result = True
            break
    return result

def reduce(pair):
    has_split = True
    while has_split:
        explode(pair)
        has_split = split(pair)
    return pair

# def reduce(arr):
#     print('begin', arr)
#     exploded, split_occurred = True, True
#     while exploded or split_occurred:
#         while True:
#             exploded = explode(arr)[1]
#             if not exploded: break
#             print('after explosion', arr)
#         while True:
#             split_occurred = split(arr)
#             if not split_occurred: break
#             else: exploded = True
#             print('after split', arr)
#     return arr
from collections import deque
if __name__ == '__main__':
    with open("18/data.txt") as f:
        data = [json.loads(line) for line in f.read().splitlines()]
    # print(data)
    # big_num = data[0]
    # for elem in data[1:]:
    #     big_num = add(big_num, elem)
    #     big_num = reduce(big_num)
    # print(big_num)
    # print(magnitude(big_num))


# arr = [[[[2,3],[[9,8],1],2],3],4]
# arr = [7,[6,[5,[4,[3,2]]]]]
# arr = [[[[[9,8],1],2],3],4]
# arr = [[6,[5,[4,[3,2]]]],[2,1]]
# print(arr)
# explode(arr)
# print(arr)  #expects [[[[0,7],4],[[7,8],[6,0]]],[8,1]]

# arr = [[[[[1, 1], [2, 2]], [3, 3]], [4, 4]], [5, 5]]
arr = [1,[2,[3,[1, 1]], [[[2, 2],3],4],5]]
print(arr)
reduce(arr)
print(arr)


# print(magnitude([[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]))
