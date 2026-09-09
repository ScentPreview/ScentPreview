import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Base replacements
    content = content.replace('#F4F4F6', '#FFFFFF')
    content = content.replace('#8A8D93', '#8A9EA7')
    content = content.replace('#FBF6F0', '#FFFFFF')
    content = content.replace('#B1B7AB', '#8A9EA7')

    if "App.tsx" in filepath:
        content = content.replace('bg-[#0B0C10]', 'bg-[#060B11]')
        
        # Glows
        content = content.replace('bg-indigo-900/20', 'bg-[#00A8E8]/20')
        content = content.replace('bg-amber-900/10', 'bg-[#FF2A55]/15')
        content = content.replace('bg-cyan-900/10', 'bg-[#00A8E8]/15')

        # Containers
        content = content.replace('bg-[#111111]', 'bg-[#0D1B2A]')
        content = content.replace('bg-[#111111]/80', 'bg-[#0D1B2A]')
        content = content.replace('bg-[#111111]/60', 'bg-[#0D1B2A]/80')
        content = content.replace('bg-[#111111]/50', 'bg-[#0D1B2A]/50')
        content = content.replace('bg-[#111111]/40', 'bg-[#0D1B2A]/40')
        
        # Borders
        content = content.replace('border-stone-800', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-800/60', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-700/50', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-800/85', 'border-[#0D1B2A]')
        
        # Others
        content = content.replace('bg-stone-900', 'bg-[#0D1B2A]')
        content = content.replace('bg-stone-950', 'bg-[#0D1B2A]/50')
        content = content.replace('text-amber-gold', 'text-[#00A8E8]')
        content = content.replace('bg-amber-gold', 'bg-[#FF2A55]')
        content = content.replace('text-[#111111]', 'text-[#FFFFFF]')
        content = content.replace('text-stone-450', 'text-[#8A9EA7]')
        
    if "ScentCard.tsx" in filepath:
        # Glassmorphic bg logic
        content = content.replace('bg-white/[0.03]', 'bg-[#0D1B2A]')
        content = content.replace('bg-white/[0.02]', 'bg-[#0D1B2A]/60')
        content = content.replace('bg-white/[0.04]', 'bg-[#060B11]')
        content = content.replace('bg-white/[0.05]', 'bg-[#0D1B2A]')
        
        content = content.replace('border-white/[0.08]', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-700/50', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-800/20', 'border-[#00A8E8]/10')
        content = content.replace('border-stone-800/40', 'border-[#00A8E8]/20')
        content = content.replace('border-stone-800/60', 'border-[#00A8E8]/30')
        
        content = content.replace('bg-indigo-500/20 text-indigo-100 border-indigo-500/30', 'bg-[#00A8E8]/20 text-[#00A8E8] border-[#00A8E8]/40')
        
        # Action Buttons
        content = content.replace('bg-amber-gold hover:bg-amber-400 text-[#111111]', 'bg-[#FF2A55] hover:bg-[#FF2A55]/80 text-[#FFFFFF]')
        content = content.replace('bg-stone-900 hover:bg-black', 'bg-[#0D1B2A] hover:bg-[#00A8E8]/80 hover:text-[#FFFFFF]')
        content = content.replace('bg-emerald-600 hover:bg-emerald-700 text-[#FFFFFF] ', 'bg-[#00A8E8] hover:bg-[#00A8E8]/80 text-[#FFFFFF] ')
        
        # Low stock / premiums
        content = content.replace('bg-stone-900/60', 'bg-[#0D1B2A]')
        content = content.replace('border-stone-700', 'border-[#00A8E8]/30')

    with open(filepath, 'w') as f:
        f.write(content)

replace_in_file("src/App.tsx")
replace_in_file("src/components/ScentCard.tsx")
