from main import move, find_new_place

def test_move_1():
    data = [1, 2, -3, 0, 3, 4, -2]
    positions = [0, 1, 2, 5, 3, 6, 4]
    expected_data = [1, 2, -3, 4, 0, 3, -2]
    move(data, positions, 6, len(data))
    assert data == expected_data

def test_move_2():
    data = [0, 1, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 0, 1]

def test_move_3():
    data = [0, 2, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 2, 0]

def test_move_4():
    data = [0, 3, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 0, 3]

def test_move_5():
    data = [0, 4, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 4, 0]

def test_move_6():
    data = [0, -1, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 0, -1]

def test_move_7():
    data = [0, -2, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, -2, 0]

def test_move_8():
    data = [0, -3, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, 0, -3]

def test_move_9():
    data = [0, -4, 0]
    move(data, [0, 1, 2], 1, len(data))
    assert data == [0, -4, 0]

def test_move_10():
    data = [2, 0, 0]
    move(data, [0, 1, 2], 0, len(data))
    assert data == [0, 0, 2]

def test_move_11():
    data = [-1, 0, 0]
    move(data, [0, 1, 2], 0, len(data))
    assert data == [0, -1, 0]

def test_find_new_place():
    n = 3
    assert find_new_place(1, 2, n) == 1
    assert find_new_place(1, 4, n) == 1
    assert find_new_place(1, 3, n) == 2
    assert find_new_place(1, -2, n) == 1
    assert find_new_place(0, -1, n) == 1
    assert find_new_place(1, -1, n) == 2
    assert find_new_place(0, 0, n) == 0

