with open("src/App.tsx", "r") as f:
    content = f.read()

start = content.find('/* STEP 2: SPLIT SCREEN WITH FULL CHECKOUT FORM AND SUMMARY */')
if start != -1:
    print(content[start:start+4000])

