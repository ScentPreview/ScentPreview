import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Remove the outer border
content = content.replace(
    'className="flex flex-col h-full bg-[#F4F4F2] border border-[#111111] p-0 relative"',
    'className="flex flex-col h-full bg-[#F4F4F2] p-0 relative"'
)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)
