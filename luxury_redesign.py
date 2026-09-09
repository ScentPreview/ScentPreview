import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Text Changes
content = content.replace("SCENT<br />ARCHIVE", "SCENT<br />PREVIEW")
content = content.replace("ByScent", "ScentPreview")

# 2. Grid lines removal (Brutalist style -> Organic style)
# Hero and Nav borders
content = content.replace('border-b border-[#111111]', 'border-b border-black/5')
content = content.replace('border-r border-[#111111]', 'border-r border-black/5')
content = content.replace('border-l border-[#111111]', 'border-l border-black/5')
content = content.replace('border border-[#111111]', 'border border-black/5 shadow-sm rounded-2xl')

# Specific brutalist grid background to organic grid
content = content.replace('gap-px bg-[#111111] border border-black/5 shadow-sm rounded-2xl', 'gap-8 bg-transparent')
content = content.replace('border-t border-b border-[#111111]', 'border-t border-b border-black/5')
content = content.replace('border-t border-[#111111]', 'border-t border-black/5')
content = content.replace('border-stone-900', 'border-black/5')
content = content.replace('divide-y divide-[#111111]', 'divide-y divide-black/5')

# Re-introduce Ambient shadows and rounded corners
content = content.replace('bg-[#F4F4F2] text-[#111111] p-6 sm:p-8 border border-black/5 shadow-sm rounded-2xl overflow-hidden relative group mb-16', 'bg-[#F4F4F2] text-[#111111] p-6 sm:p-8 border border-black/5 rounded-3xl shadow-2xl shadow-black/5 overflow-hidden relative group mb-16')

# 3. Typography changes (Raw code font -> Refined luxury)
# We want to replace most 'font-mono' with 'font-sans tracking-widest' or 'font-serif' where appropriate.
# Button replacements
content = content.replace('font-mono text-xs tracking-widest uppercase', 'font-sans text-xs tracking-[0.2em] uppercase font-medium')
content = content.replace('font-mono text-[10px] tracking-widest uppercase', 'font-sans text-[10px] tracking-[0.2em] uppercase font-medium')
content = content.replace('font-mono tracking-widest', 'font-sans tracking-[0.2em]')
content = content.replace('font-mono text-sm tracking-widest uppercase', 'font-sans text-sm tracking-[0.2em] uppercase font-medium')
content = content.replace('font-mono uppercase', 'font-sans tracking-[0.15em] uppercase')
content = content.replace('font-mono text-[9px]', 'font-sans text-[10px]')
content = content.replace('font-mono text-xs', 'font-sans text-[11px] tracking-wider')

# Swap out text-6xl/9xl font-sans font-black to luxury serif
content = content.replace('text-6xl md:text-9xl font-sans font-black', 'text-6xl md:text-8xl font-serif font-medium italic')

with open("src/App.tsx", "w") as f:
    f.write(content)

