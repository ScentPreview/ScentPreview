with open("src/App.tsx", "r") as f:
    lines = f.readlines()

with open("src/App.tsx", "w") as f:
    for i, line in enumerate(lines):
        if 513 <= i <= 541:
            continue
        f.write(line)

