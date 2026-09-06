import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# 1. Discounted Price Container (Top)
content = content.replace(
    '<div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-700/50 font-mono">',
    '<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 pb-3 border-b border-stone-700/50 font-mono gap-1 xl:gap-0">'
)

# 2. Top Details & Badges
content = content.replace(
    '<div className="flex items-center justify-between gap-2 mb-2.5">',
    '<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-2 mb-2.5">'
)
content = content.replace(
    '<div className="flex flex-col items-end gap-1">',
    '<div className="flex flex-row xl:flex-col items-center xl:items-end gap-1 flex-wrap mt-1 xl:mt-0">'
)

# 3. Size Selector Toggle Labels
content = content.replace(
    '<span className="truncate">{size === "5ml Normal" ? "5ml N" : size}</span>',
    '''<span className="truncate hidden sm:inline">{size === "5ml Normal" ? "5ml N" : size}</span>
                <span className="truncate sm:hidden">{size === "5ml Normal" ? "5N" : size === "5ml HQ" ? "5HQ" : "10"}</span>'''
)

# 4. Subtotal & Quantity box
content = content.replace(
    '<div className="flex items-center justify-between mb-4 bg-[#111111]/40 border border-stone-800/20 p-2 rounded-xl">',
    '<div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between mb-4 bg-[#111111]/40 border border-stone-800/20 p-2 rounded-xl gap-2 2xl:gap-0 w-full">'
)
content = content.replace(
    '<div className="flex flex-col items-end">',
    '<div className="flex flex-col items-start 2xl:items-end w-full 2xl:w-auto">'
)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

