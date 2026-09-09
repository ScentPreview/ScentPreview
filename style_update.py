import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Hex mappings
    # Old -> New
    content = content.replace('bg-[#060B11]', 'bg-[#F4F4F2]')
    content = content.replace('bg-[#0D1B2A]/60', 'bg-[#FFFFFF]/60')
    content = content.replace('bg-[#0D1B2A]/50', 'bg-[#FFFFFF]/50')
    content = content.replace('bg-[#0D1B2A]/40', 'bg-[#FFFFFF]/40')
    content = content.replace('bg-[#0D1B2A]/80', 'bg-[#FFFFFF]/80')
    content = content.replace('bg-[#0D1B2A]', 'bg-[#FFFFFF]') # white cards

    content = content.replace('text-[#FFFFFF]', 'text-[#111111]') # primary text
    content = content.replace('text-[#8A9EA7]', 'text-[#666666]') # secondary text
    
    # Glows -> remove or lighten
    content = content.replace('bg-[#00A8E8]/20', 'bg-[#0E0E0E]/5')
    content = content.replace('bg-[#FF2A55]/15', 'bg-[#0E0E0E]/5')
    content = content.replace('bg-[#00A8E8]/15', 'bg-[#0E0E0E]/5')
    
    # Borders
    content = content.replace('border-[#00A8E8]/10', 'border-[#E0E0E0]')
    content = content.replace('border-[#00A8E8]/20', 'border-[#E0E0E0]')
    content = content.replace('border-[#00A8E8]/30', 'border-[#E0E0E0]')
    content = content.replace('border-[#00A8E8]/40', 'border-[#E0E0E0]')
    
    # Buttons
    content = content.replace('bg-[#FF2A55]', 'bg-[#000000]')
    content = content.replace('hover:bg-[#FF2A55]/80', 'hover:bg-[#333333]')
    content = content.replace('bg-[#00A8E8]', 'bg-[#000000]')
    content = content.replace('hover:bg-[#00A8E8]/80', 'hover:bg-[#333333]')
    
    # Text in buttons might have been changed to #111111 because of the earlier replace.
    # We want CTAs to be white text.
    
    with open(filepath, 'w') as f:
        f.write(content)

update_file("src/App.tsx")
update_file("src/components/ScentCard.tsx")

