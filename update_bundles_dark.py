import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# I will just wrap the bundles in a dark section block
old_bundles_start = '{/* Curated Capsule Bundles Subsection */}'

# Because it's inside <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-32">, I should close it and reopen it?
# Let's find where Bundles start and ends. It might be easier to just change the Spotlight Bundle card to Canvas Dark.
# Currently: spotlight bundle has `bg-[#FFFFFF]/50`. Let's change Spotlight Bundle and Standard Bundles to #0E0E0E.

content = content.replace(
    'className="lg:col-span-8 bg-[#FFFFFF]/50 text-[#FFFFFF] text-shadow-sm rounded-sm p-8 flex flex-col justify-between relative overflow-hidden group min-h-[320px]"',
    'className="lg:col-span-8 bg-[#0E0E0E] text-[#FFFFFF] text-shadow-sm rounded-sm p-8 flex flex-col justify-between relative overflow-hidden group min-h-[320px]"'
)

content = content.replace(
    'className="lg:col-span-4 bg-[#FFFFFF]/50 text-[#FFFFFF] text-shadow-sm rounded-sm p-6 flex flex-col justify-between relative overflow-hidden group min-h-[320px] lg:min-h-0"',
    'className="lg:col-span-4 bg-[#0E0E0E] text-[#FFFFFF] text-shadow-sm rounded-sm p-6 flex flex-col justify-between relative overflow-hidden group min-h-[320px] lg:min-h-0"'
)

with open("src/App.tsx", "w") as f:
    f.write(content)
