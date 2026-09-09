import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix 1: The `)}}`
content = content.replace("          </div>\n        )}}", "          </div>\n        )}")

# Fix 2: Remove the leftover chunk from `}}.00` to the quizzes section
# First, find the quizzes section start
quiz_idx = content.find('{/* Explore Quizzes & Find Your Scent */}')
if quiz_idx != -1:
    # Find the `)}}.00`
    bad_idx = content.find('        )}}.00')
    if bad_idx != -1:
        # replace the bad chunk with just `)}`
        content = content[:bad_idx] + '        )}\n\n' + content[quiz_idx:]

with open("src/App.tsx", "w") as f:
    f.write(content)

