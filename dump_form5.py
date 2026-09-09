with open("src/App.tsx", "r") as f:
    content = f.read()

start = content.find('checkoutEmail}')
if start != -1:
    print(content[start:start+4000])

