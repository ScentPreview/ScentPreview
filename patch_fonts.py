import re

with open("index.html", "r") as f:
    content = f.read()

fonts = """    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">"""

if "fonts.googleapis.com" not in content:
    content = content.replace("  </head>", fonts + "\n  </head>")

with open("index.html", "w") as f:
    f.write(content)
