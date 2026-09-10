import re
with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'className="w-full bg-[#FFFFFF] hover:bg-black py-4  text-xs font-mono text-black  tracking-widest uppercase font-bold cursor-pointer "',
    'className="w-full bg-[#FFFFFF] hover:bg-black py-4  text-xs font-mono text-black hover:text-white tracking-widest uppercase font-bold cursor-pointer "'
)

with open("src/App.tsx", "w") as f:
    f.write(content)
