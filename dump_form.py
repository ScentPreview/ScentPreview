with open("src/App.tsx", "r") as f:
    content = f.read()

start = content.find(') : (')
if start != -1:
    print(content[start:start+2000])

