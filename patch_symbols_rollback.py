import re

with open("src/App.tsx", "r") as f:
    content = f.read()
content = content.replace("BUNDLE CAPSULES", "[ BUNDLE CAPSULES ]")
content = content.replace("RE-DEFINING THE DECANT 2026 EDITION", "[ RE-DEFINING THE DECANT 2026 EDITION ]")
with open("src/App.tsx", "w") as f:
    f.write(content)

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()
content = content.replace("SOLD OUT", "[ SOLD OUT ]")
content = content.replace('<span>{fragrance.id}</span>', '<span>[ {fragrance.id} ]</span>')
with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

