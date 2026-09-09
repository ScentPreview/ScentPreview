import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove text-shadow classes that cause the "blur" effect
    content = content.replace('text-shadow-sm', '')
    content = content.replace('text-shadow', '')
    
    if "App.tsx" in filepath:
        # 2. Fix the opening hero section that is black
        content = content.replace(
            '<section className="relative w-full bg-[#0E0E0E] text-white py-16 md:py-32 mb-16">',
            '<section className="relative w-full bg-[#F4F4F2] text-[#111111] py-16 md:py-32 mb-16 border-b border-[#E0E0E0]">'
        )
        content = content.replace('text-white', 'text-[#111111]')
        content = content.replace('text-stone-400', 'text-[#666666]')
        
        # 3. Fix the bundles section that might also be black
        content = content.replace(
            'bg-[#0E0E0E] text-[#FFFFFF]',
            'bg-[#FFFFFF] text-[#111111] border border-[#E0E0E0]'
        )
        
        # Fix the top wrapper if it has stray text shadow classes or wrong text color
        content = content.replace('text-[#F4F4F6]', 'text-[#111111]')
        
    with open(filepath, 'w') as f:
        f.write(content)

fix_file("src/App.tsx")
fix_file("src/components/ScentCard.tsx")

