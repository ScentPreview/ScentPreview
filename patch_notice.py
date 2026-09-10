import re
with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "[ NOTICE: Claims must be submitted within 48 hours of shipping. Approved replacements require a re-dispatch fee. ]",
    "CLAIMS MUST BE SUBMITTED WITHIN 48 HOURS OF SHIPPING."
)

with open("src/App.tsx", "w") as f:
    f.write(content)
