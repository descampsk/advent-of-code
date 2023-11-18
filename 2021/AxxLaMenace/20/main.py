def count_lit_pixels(image):
    return sum([sum([1 for c in row if c == "#"]) for row in image])

def convert_to_bin(pixels):
    d = {'#': '1', '.': '0'}
    return int(''.join([d[pix] for pix in pixels]), 2)

def enhance(image, pixel):
    image = surround_image_with_pixels(image, pixel)
    new_image = ['']*(len(image) -2)
    for i in range(1,len(image)-1):
        for j in range(1, len(image[0])-1):
            pixels = [image[i1][j1] for i1, j1 in get_nine_pixels(i, j)]
            new_image[i-1] += algorithm[convert_to_bin(pixels)]
    return new_image

def get_nine_pixels(i, j):
    for di in (-1, 0, 1):
        for dj in (-1, 0, 1):
            yield (i + di, j + dj)

def surround_image_with_pixels(image, pixel='.', layer=2):
    image = layer*[pixel*len(image[0])] + image + layer*[pixel*len(image[0])]
    return [layer*pixel + row + layer*pixel for row in image]

def solve_first_puzzle(image):
    image = enhance(enhance(image, '.'), '#')
    return count_lit_pixels(image)

def solve_second_puzzle(image):
    d = {1: '#', 0: '.'}
    for i in range(50):
        print(i)
        image = enhance(image, d[i%2])
    return count_lit_pixels(image)


with open("20/data.txt") as f:
    blocks = f.read().split('\n\n')
algorithm, image = blocks
image = image.split('\n')
print("result first puzzle:", solve_first_puzzle(image))
print("result second puzzle:", solve_second_puzzle(image))

# pixels = [
#     '.........',
#     '#########'
# ]
# for pixel in pixels:
#     print(pixel, 'result', algorithm[convert_to_bin(pixel)])