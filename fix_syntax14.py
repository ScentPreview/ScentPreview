import re

with open("src/App.tsx", "r") as f:
    content = f.read()

start = content.find(')}.00')
if start != -1:
    # We want to replace from start until the line `          </div>\n        )}`
    # Or simply until `</section>\n      {/* Modern Editorial Footer */}`
    end_tag = '</section>'
    end = content.find(end_tag, start)
    if end != -1:
        content = content[:start] + ')}\n      ' + end_tag + content[end+len(end_tag):]
        with open("src/App.tsx", "w") as f:
            f.write(content)
        print("Fixed start to end")
    else:
        print("Could not find end")
