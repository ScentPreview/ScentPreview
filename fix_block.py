with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "useEffect(() => {" in line and "let interval: any = null;" in lines[lines.index(line) + 1]:
        skip = True
    
    if skip and "}, [adminLockoutTime]);" in line:
        skip = False
        continue
        
    if not skip:
        new_lines.append(line)

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)
