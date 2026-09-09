import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("(citrus, woody, warm, leather)", "citrus, woody, warm, leather")

with open("src/App.tsx", "w") as f:
    f.write(content)
