import re
with open("src/App.tsx", "r") as f:
    content = f.read()

# remove that broken useEffect
content = re.sub(
    r'  useEffect\(\(\) => \{\n    let interval: any = null;\n\n    const checkLockout = \(\) => \{.*?\n  \}, \[adminLockoutTime\]\);\n',
    '',
    content,
    flags=re.DOTALL
)

with open("src/App.tsx", "w") as f:
    f.write(content)
