from main import convert_range


def test_convert_range_1():
    mapping = ["50 98 2", "52 50 48"]
    seeds = [[79, 14], [55, 13]]
    res = convert_range(mapping, seeds)
    assert res == [(81, 14), (57, 13)]


def test_convert_range_2():
    mapping = ["50 0 2", "0 25 10"]
    seeds = [[0, 0], [25, 0]]
    res = convert_range(mapping, seeds)
    assert res == [(50, 0), (0, 0)]


def test_convert_range_2():
    mapping = ["10 0 2"]
    seeds = [[0, 1]]
    res = convert_range(mapping, seeds)
    assert res == [(10, 1)]


# def test_convert_range_2():
#     mapping = ["50 0 2", "0 25 10"]
#     seeds = [[0, 1], [25, 2]]
#     res = convert_range(mapping, seeds)
#     assert res == [(50, 1), (0, 0), (0, 2)]
