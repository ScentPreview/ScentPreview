import re
with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace reversed hover colors
content = content.replace("bg-[#FFFFFF] hover:bg-stone-900 hover:text-black text-white", "bg-[#FFFFFF] hover:bg-stone-900 hover:text-white text-black")

# Replace dark bg with black text -> dark bg with white text
content = content.replace("hover:bg-stone-850 text-black hover:text-black", "hover:bg-stone-850 text-black hover:text-white")
content = content.replace("bg-stone-800 hover:bg-stone-700 text-black", "bg-stone-800 hover:bg-stone-700 text-white")
content = content.replace("bg-stone-800 text-black font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4  cursor-not-allowed", "bg-stone-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4  cursor-not-allowed")
content = content.replace("bg-stone-800 px-2 py-0.5  border border-stone-750", "bg-stone-800 px-2 py-0.5 text-white border border-stone-750")
content = content.replace("bg-stone-800 text-black  px-1.5 py-0.5  text-[10px]", "bg-stone-800 text-white px-1.5 py-0.5 text-[10px]")

# Fix specific buttons
content = content.replace("bg-stone-800 hover:bg-emerald-600 text-black hover:text-black", "bg-stone-800 hover:bg-emerald-600 text-white hover:text-white")
content = content.replace("bg-stone-800 hover:bg-indigo-600 text-black hover:text-black", "bg-stone-800 hover:bg-indigo-600 text-white hover:text-white")
content = content.replace("bg-stone-800 hover:bg-amber-600 text-black hover:text-black", "bg-stone-800 hover:bg-amber-600 text-white hover:text-white")
content = content.replace("bg-stone-800 hover:bg-rose-600 text-black hover:text-black", "bg-stone-800 hover:bg-rose-600 text-white hover:text-white")

# Also look for any bg-black text-black
content = content.replace("bg-black text-black", "bg-black text-white")

with open("src/App.tsx", "w") as f:
    f.write(content)
