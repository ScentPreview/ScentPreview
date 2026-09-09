import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Find the end of the new bundles section
start = content.find(')}.00')
if start != -1:
    end = content.find('</section>', start)
    if end != -1:
        content = content[:start] + ')}\n      </section>' + content[end+10:]
        print("Fixed bundles!")

with open("src/App.tsx", "w") as f:
    f.write(content)

