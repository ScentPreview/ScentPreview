import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make sure buttons that are black have white text
content = re.sub(r'bg-black([^>]*?)text-stone-900', r'bg-black\1text-white', content)
content = re.sub(r'bg-black([^>]*?)text-black', r'bg-black\1text-white', content)

# bg-[#111111] buttons
content = re.sub(r'bg-\[\#111111\]([^>]*?)text-stone-900', r'bg-[#111111]\1text-white', content)
content = re.sub(r'bg-\[\#111111\]([^>]*?)text-black', r'bg-[#111111]\1text-white', content)

# But ensure hover:text-black might be there on white hover backgrounds? 
# Usually, hover:bg-stone-900 etc.

# Also, ensure backgrounds like bg-[#FFFFFF] don't have text-white
content = re.sub(r'bg-\[\#FFFFFF\]([^>]*?)text-white', r'bg-[#FFFFFF]\1text-black', content)
content = re.sub(r'bg-[#F7F7F5]([^>]*?)text-white', r'bg-[#F7F7F5]\1text-black', content)

# Check specifically for "Add to Cart" block replacement we did
# And the "Sold Out" replacements.
# Let's check `fix_colors.py` output logic.

with open("src/App.tsx", "w") as f:
    f.write(content)

