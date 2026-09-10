import re
with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("bg-[#FFFFFF] hover:bg-red-50 text-red-600 border border-red-200", "bg-[#FFFFFF] hover:bg-red-50 text-black border border-red-200")

with open("src/App.tsx", "w") as f:
    f.write(content)
