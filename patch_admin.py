import re
with open("src/App.tsx", "r") as f:
    content = f.read()

content = re.sub(
    r'  useEffect\(\(\) => \{\n    let interval: any = null;\n\n    const checkLockout = \(\) => \{.*?\n  \}, \[adminLockoutTime\]\);\n',
    "",
    content,
    flags=re.DOTALL
)

content = re.sub(r'isAdminLocked', 'false', content)
content = re.sub(r'setAdminAttempts\(0\);', '', content)
content = re.sub(r'setAdminLockoutTime\(null\);', '', content)
content = re.sub(r'setLockoutTimeRemaining\(""\);', '', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
