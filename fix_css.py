import re

with open("src/index.css", "r") as f:
    content = f.read()

# Make background more natural luxury
content = content.replace("background: #F4F4F2;", "background: #F7F7F5;")

with open("src/index.css", "w") as f:
    f.write(content)

