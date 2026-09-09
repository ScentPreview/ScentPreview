import re

with open("index.html", "r") as f:
    content = f.read()

content = re.sub(r'<link rel="icon" type="image/svg\+xml" href="[^"]*" />', r'<link rel="icon" type="image/svg+xml" href="/favicon.svg" />', content)

with open("index.html", "w") as f:
    f.write(content)

