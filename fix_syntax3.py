import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Let's just find the string block literally
start = content.find('        )}.00')
if start != -1:
    end = content.find('{/* Explore Quizzes & Find Your Scent */}')
    if end != -1:
        content = content[:start] + '        )}\n\n        ' + content[end:]

with open("src/App.tsx", "w") as f:
    f.write(content)

