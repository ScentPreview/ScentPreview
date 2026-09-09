import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = re.sub(r'\{/\* Ambient Radial Glows \*/\}.*?z-0"></div>', '', content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)

