import re

with open("src/index.css", "r") as f:
    content = f.read()

# Update the imports for fonts to include Inter, JetBrains Mono, and Space Mono
font_import = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');"
content = re.sub(r"@import url\([^)]+\);", font_import, content)

# Update the @theme settings
# Primary Font: Inter -> font-sans
# Secondary / Data Font: JetBrains Mono -> font-mono
# Accent / Highlight Font: Space Mono -> font-serif (since font-serif was used for headers but now they want Inter, wait let's just make font-sans Inter, font-mono JetBrains Mono, and font-serif Space Mono). The prompt says:
# "1. Primary Font (Headers, Product Names, Buttons) Inter... 2. Secondary/Data... JetBrains Mono... 3. Accent... Space Mono"

new_theme = """@theme {
  --font-sans: "Inter", "Helvetica Now", Arial, sans-serif;
  --font-serif: "Space Mono", "Roboto Mono", monospace;
  --font-mono: "JetBrains Mono", "SF Mono", monospace;"""

content = re.sub(r"@theme \{\n\s*--font-sans:[^;]+;\n\s*--font-serif:[^;]+;\n\s*--font-mono:[^;]+;", new_theme, content)

with open("src/index.css", "w") as f:
    f.write(content)

