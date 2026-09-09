import re

with open("src/index.css", "r") as f:
    content = f.read()

content = content.replace('background: #060B11;', 'background: #F4F4F2;')
content = content.replace('color: #FFFFFF;', 'color: #111111;')

with open("src/index.css", "w") as f:
    f.write(content)
