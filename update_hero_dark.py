import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make the hero section dark
old_hero = '      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">'
new_hero = '      <section className="relative w-full bg-[#0E0E0E] text-white py-16 md:py-32 mb-16"><div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">'
content = content.replace(old_hero, new_hero)

# Now fix the text colors inside the hero
# I'll just regex replace text-[#111111] to text-white and text-[#666666] to text-stone-400 ONLY between new_hero and the end of the section 
hero_split = content.split(new_hero)
if len(hero_split) == 2:
    # Find the end of the section:
    # Look for </section> after the hero start
    end_idx = hero_split[1].find('</section>')
    if end_idx != -1:
        hero_content = hero_split[1][:end_idx]
        hero_content = hero_content.replace('text-[#111111]', 'text-white')
        hero_content = hero_content.replace('text-[#666666]', 'text-stone-400')
        # Close the added <div className="max-w-7xl mx-auto...
        new_content = hero_split[0] + new_hero + hero_content + '</div></section>' + hero_split[1][end_idx+10:]
        content = new_content

with open("src/App.tsx", "w") as f:
    f.write(content)
