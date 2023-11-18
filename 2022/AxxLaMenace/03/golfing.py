def t(s):return sum(ord(c)-ord('&')if c.isupper()else ord(c)-ord('`')for c in s)
with open("03/data.txt")as f:d=f.read().split('\n')
print(t([(set(r[:len(r)//2])&set(r[len(r)//2:])).pop()for r in d]))
print(t([(set(d[i])&set(d[i+1])&set(d[i+2])).pop()for i in range(0,len(d),3)]))