import re

with open("src/index.css", "r") as f:
    content = f.read()

content = content.replace('background: linear-gradient(135deg, #0B0C10 0%, #121318 100%);', 'background: #060B11;')
content = content.replace('color: #F4F4F6;', 'color: #FFFFFF;')

with open("src/index.css", "w") as f:
    f.write(content)

