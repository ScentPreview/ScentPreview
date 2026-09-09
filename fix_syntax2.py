import re

with open("src/App.tsx", "r") as f:
    content = f.read()

quiz_idx = content.find('{/* Explore Quizzes & Find Your Scent */}')
if quiz_idx != -1:
    # Find the `)}.00`
    bad_idx = content.find('        )}.00')
    if bad_idx != -1:
        # replace the bad chunk with just `)}`
        content = content[:bad_idx] + '        )}\n\n' + content[quiz_idx:]

with open("src/App.tsx", "w") as f:
    f.write(content)

