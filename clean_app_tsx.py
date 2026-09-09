import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix 1: The double `}}` for the first grid block
content = content.replace("          </div>\n        )}}", "          </div>\n        )}")

# Fix 2: The remaining bundle code that is causing issues
# Let's find where the `}}` is for the bundles
# Actually, looking at the snippet, after `)}` of the new bundle section, there is `}.00` and then all the old spotlight code.
# I will just replace from `        )}}` down to `{/* Explore Quizzes & Find Your Scent */}` with just the new bundle section and the No matching block.
