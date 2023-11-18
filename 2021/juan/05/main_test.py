import unittest
from main import getLineCoordinates

class TestDay05Part01(unittest.TestCase):
    def test_getLineCoordinates(self):
        # Vertical - Increasing
        self.assertEqual(getLineCoordinates([1, 1, 1, 2]), [[1, 1], [1, 2]])
        self.assertEqual(getLineCoordinates([1, 1, 1, 3]), [[1, 1], [1, 2], [1, 3]])
        
        # Vertical - Decreasing
        self.assertEqual(getLineCoordinates([1, 2, 1, 1]), [[1, 1], [1, 2]])
        self.assertEqual(getLineCoordinates([1, 3, 1, 1]), [[1, 1], [1, 2], [1, 3]])
        
        # Horizontal - Increasing
        self.assertEqual(getLineCoordinates([1, 1, 2, 1]), [[1, 1], [2, 1]])
        self.assertEqual(getLineCoordinates([1, 1, 3, 1]), [[1, 1], [2, 1], [3, 1]])

        # Horizontal - Decreasing
        self.assertEqual(getLineCoordinates([2, 1, 1, 1]), [[1, 1], [2, 1]])
        self.assertEqual(getLineCoordinates([3, 1, 1, 1]), [[1, 1], [2, 1], [3, 1]])
