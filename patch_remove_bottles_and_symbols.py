import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Remove InteractiveBottle import and rendering
content = re.sub(r'import InteractiveBottle from "\./components/InteractiveBottle";\n', '', content)

# Remove the Featured Stage completely since it only holds the bottle
bottle_stage = r'''        <div className="flex-1 bg-stone-900 p-8 md:p-16 flex flex-col items-center justify-center relative min-h-\[500px\]">
          <div className="absolute top-8 left-8">
             <span className="text-\[9px\] font-sans tracking-\[0\.2em\] text-white uppercase opacity-50">
               FEATURED STAGE
             </span>
          </div>
          <div className="w-full max-w-sm">
             <InteractiveBottle />
          </div>
        </div>'''
content = re.sub(bottle_stage, '', content, flags=re.DOTALL)

# Let's fix the layout of the hero section so it doesn't look broken without the bottle.
# The parent of that is `<div className="flex flex-col lg:flex-row w-full min-h-screen">`.
# The left column is `<div className="flex-1 flex flex-col p-6 md:p-12 lg:p-20 relative z-10">`
# We can just leave the left column to expand or be centered? 
# Wait, if we remove `flex-1` from the left column it might not fill the screen. It already has `flex-1`.
# Let's see how it looks if we just remove the right column.

# 2. Remove symbols from text
# "MEN'S COLLECTION 0.2 0.2" -> "MEN'S COLLECTION 0.2"
content = content.replace("WOMEN'S COLLECTION 0.2 0.2", "WOMEN'S COLLECTION 0.2")

content = content.replace("[ RE-DEFINING THE DECANT 2026 EDITION ]", "RE-DEFINING THE DECANT EDITION 0.2")
content = content.replace("[ EDITION 2026 ]", "EDITION 0.2")
content = content.replace("[ BUNDLE CAPSULES ]", "BUNDLE CAPSULES")
content = content.replace("[ ADMIN / REGISTERED CLAIMS ]", "ADMIN REGISTERED CLAIMS")

with open("src/App.tsx", "w") as f:
    f.write(content)

with open("src/components/ScentCard.tsx", "r") as f:
    card_content = f.read()

card_content = card_content.replace("[ SOLD OUT ]", "SOLD OUT")
card_content = card_content.replace("[ {fragrance.type} ]", "{fragrance.type}")
card_content = card_content.replace("Tag: [", "Tag:")
card_content = card_content.replace("] </p>", "</p>")

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(card_content)

