import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix light colors in the prices tab
content = content.replace('text-emerald-400', 'text-emerald-700')
content = content.replace('text-rose-400', 'text-rose-700')
content = content.replace('text-rose-500', 'text-rose-700')
content = content.replace('text-[#00A8E8]', 'text-black')
content = content.replace('bg-stone-925', 'bg-stone-50')
content = content.replace('bg-[#FFFFFF]/40', 'bg-stone-50')
content = content.replace('border-stone-850', 'border-stone-200')

with open("src/App.tsx", "w") as f:
    f.write(content)

