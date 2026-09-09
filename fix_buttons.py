import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix buttons hovering into black on black
content = content.replace("hover:bg-black text-[#111111]", "hover:bg-[#111111] hover:text-[#F4F4F2] text-[#111111]")
content = content.replace("hover:bg-[#000000] text-[#111111]", "hover:bg-[#111111] hover:text-[#F4F4F2] text-[#111111]")
content = content.replace("hover:bg-[#111111] text-[#111111]", "hover:bg-[#111111] hover:text-[#F4F4F2] text-[#111111]")

with open("src/App.tsx", "w") as f:
    f.write(content)

