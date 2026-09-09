import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Fix the size selection buttons text color issue
target_sizes = '''                  isSelected ? "bg-black text-white" : isSizeDisabled ? "text-white/60 line-through cursor-not-allowed bg-black/5" : "text-white hover:bg-black/5"'''
replacement_sizes = '''                  isSelected ? "bg-black text-white" : isSizeDisabled ? "text-black/40 line-through cursor-not-allowed bg-black/5" : "text-black hover:bg-black/5"'''
content = content.replace(target_sizes, replacement_sizes)

# Fix the quantity buttons text color issue
target_qty = '''className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-white border-r border-black/5 font-sans"'''
replacement_qty = '''className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-black border-r border-black/5 font-sans"'''
content = content.replace(target_qty, replacement_qty)

target_qty_2 = '''className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-white border-l border-black/5 font-sans"'''
replacement_qty_2 = '''className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-black border-l border-black/5 font-sans"'''
content = content.replace(target_qty_2, replacement_qty_2)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

