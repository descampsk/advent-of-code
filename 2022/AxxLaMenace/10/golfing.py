w,x,L = 40,1,[1,1]
for e in [r.split()for r in open('10/data.txt').read().split('\n')]:
    if len(e)>1:x+=int(e[-1])
    L+=[x]*len(e)
print(sum((i+1)*L[i] for i in range(19, 220, w)))
r=''.join(['#'if abs(p%w-s)<2 else ' 'for p,s in enumerate(L)])
for i in range(0,len(r),w):print(r[i:i+w])