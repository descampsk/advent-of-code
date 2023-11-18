def step(x, y, vx, vy):
    x += vx
    y += vy
    vx = (abs(vx)-1)*vx//abs(vx) if vx else 0
    vy -= 1
    return x, y, vx, vy

def attempt(target, vx, vy):
    [[Xmin, Xmax], [Ymin, Ymax]] = target
    x, y = 0, 0
    y_reach = 0
    while y >= Ymin:
        x, y, vx, vy = step(x, y, vx, vy)
        print('x, y', x, y)
        if vy == 0:
            y_reach = y
        if Xmin <= x <= Xmax and Ymin <= y <= Ymax:
            print('victory, y_reach=', y_reach)
            print('x, y', x, y)
            return True, y_reach
    print('dépassé x, y', x, y)
    return False, -1

if __name__ == '__main__':
    with open("17/data.txt") as f:
        data = f.readline()
    target = [[int(num) for num in e.split('..')] for e in data.replace('target area: x=', '').split(', y=')]
    [[Xmin, Xmax], [Ymin, Ymax]] = target
    # vx = 17
    # vy = 4
    # attempt(target, vx, vy)
    # attempt(target, 6, 9)

y = -Ymin-1
print('first part solution is', y*(y+1)//2)
