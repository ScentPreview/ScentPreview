import re
with open("src/App.tsx", "r") as f:
    content = f.read()
content = content.replace('alert("All fields are required, including an image proof.");', 'alert("Please fill out all required fields.");')
with open("src/App.tsx", "w") as f:
    f.write(content)
