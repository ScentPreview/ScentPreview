import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Soften harsh button corners globally for the fluid aesthetic
content = content.replace("rounded-sm", "rounded-xl")
content = content.replace("rounded-md", "rounded-2xl")
content = content.replace("apple-liquid-btn", "")

# Change general background elements to standard #FFFFFF or soft colors rather than transparent/harsh
content = content.replace("bg-white/[0.03]", "bg-stone-50")
content = content.replace("border-[#E0E0E0]", "border-stone-200")
content = content.replace("text-[#666666]", "text-stone-500")
content = content.replace("text-[#111111]", "text-stone-900")
content = content.replace("bg-[#111111]", "bg-stone-900")
content = content.replace("hover:bg-[#111111]", "hover:bg-stone-800")
content = content.replace("bg-[#000000]", "bg-black")
content = content.replace("hover:bg-[#000000]", "hover:bg-stone-900")

with open("src/App.tsx", "w") as f:
    f.write(content)

