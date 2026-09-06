import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# 1. Card Container padding
content = content.replace(
    'className="relative rounded-2xl p-6 md:p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:border-[#276152]/60 border border-[#276152]/30 bg-[#111111]/95"',
    'className="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:border-[#276152]/60 border border-[#276152]/30 bg-[#111111]/95"'
)

# 2. Discounted Price Container
content = content.replace(
    '<div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-700/50 font-mono">',
    '<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-stone-700/50 font-mono gap-1 xl:gap-0">'
)

content = content.replace(
    '<span className="text-[10px] text-[#B1B7AB]/90 line-through font-normal">',
    '<span className="text-[9px] sm:text-[10px] text-[#B1B7AB]/90 line-through font-normal">'
)

content = content.replace(
    '<span className="text-[8px] text-[#B1B7AB]/90 font-sans uppercase tracking-widest font-bold">',
    '<span className="text-[7px] sm:text-[8px] text-[#B1B7AB]/90 font-sans uppercase tracking-widest font-bold">'
)

content = content.replace(
    '<span className="text-sm font-bold text-[#FBF6F0] ">',
    '<span className="text-xs sm:text-sm font-bold text-[#FBF6F0] ">'
)

# 3. Top Details & Badges
content = content.replace(
    '<div className="flex items-center justify-between gap-2 mb-2.5">',
    '<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">'
)

content = content.replace(
    '<span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#B1B7AB]/90 font-semibold">',
    '<span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] text-[#B1B7AB]/90 font-semibold">'
)

content = content.replace(
    '<div className="flex flex-col items-end gap-1">',
    '<div className="flex flex-row xl:flex-col items-center xl:items-end gap-1 flex-wrap">'
)

content = content.replace(
    '<span className="inline-flex items-center gap-1 bg-[#276152] text-[#FBF6F0] border border-[#0D3A35] text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">',
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#276152] text-[#FBF6F0] border border-[#0D3A35] text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm">'
)

content = content.replace(
    '<span className="inline-flex items-center gap-1 bg-stone-900/60 border border-stone-700 text-[#B1B7AB] text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold">',
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-stone-900/60 border border-stone-700 text-[#B1B7AB] text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm font-bold">'
)

content = content.replace(
    '<span className="inline-flex items-center gap-1 bg-red-950/40 border border-red-900/50 text-red-400 text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold animate-pulse">',
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-red-950/40 border border-red-900/50 text-red-400 text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm font-bold animate-pulse">'
)

# 4. Product Title
content = content.replace(
    '<h3 className="text-lg font-serif italic text-[#FBF6F0]  tracking-tight mb-2">',
    '<h3 className="text-base sm:text-lg font-serif italic text-[#FBF6F0] leading-tight tracking-tight mb-1.5 sm:mb-2">'
)

# 5. Scent Notes Badges
content = content.replace(
    '<div className="flex flex-wrap gap-1.5 mb-5">',
    '<div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">'
)

content = content.replace(
    'className="text-[10px] px-2.5 py-0.5 border border-stone-800/60 rounded-full font-mono font-medium tracking-wider transition-colors text-[#FBF6F0] bg-[#111111]/90 hover:bg-[#276152]/80 hover:border-[#276152] shadow-sm"',
    'className="text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 border border-stone-800/60 rounded-full font-mono font-medium tracking-wider transition-colors text-[#FBF6F0] bg-[#111111]/90 hover:bg-[#276152]/80 hover:border-[#276152] shadow-sm"'
)

# 6. Size Selector
content = content.replace(
    '<span className="block text-[8px] font-mono uppercase tracking-widest text-[#B1B7AB] mb-2">',
    '<span className="block text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-[#B1B7AB] mb-1.5 sm:mb-2">'
)

content = content.replace(
    '<div className="grid grid-cols-3 gap-1 p-1 bg-[#276152]/50 rounded-xl border border-stone-700/50 relative shadow-2xs">',
    '<div className="grid grid-cols-3 gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-[#276152]/50 rounded-lg sm:rounded-xl border border-stone-700/50 relative shadow-2xs">'
)

content = content.replace(
    'className={`relative py-1.5 text-[9px] font-mono rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${',
    'className={`relative py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-mono rounded-md sm:rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${'
)

# Replace the text inside the button span for smaller screens
content = content.replace(
    '<span className="truncate">{size === "5ml Normal" ? "5ml N" : size}</span>',
    '''<span className="truncate hidden sm:inline">{size === "5ml Normal" ? "5ml N" : size}</span>
                <span className="truncate sm:hidden">{size === "5ml Normal" ? "5N" : size === "5ml HQ" ? "5HQ" : "10"}</span>'''
)

# 7. Low stock alert in pricing row
content = content.replace(
    '<div className="mb-3 px-3 py-1.5 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-center gap-1.5">',
    '<div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50/80 border border-amber-200/60 rounded-lg sm:rounded-xl flex items-center gap-1.5">'
)
content = content.replace(
    '<span className="text-[10px] font-mono font-medium text-amber-850 uppercase tracking-wide">',
    '<span className="text-[8px] sm:text-[10px] font-mono font-medium text-amber-850 uppercase tracking-wide">'
)

# 8. Subtotal & Quantity box
content = content.replace(
    '<div className="flex items-center justify-between mb-4 bg-[#111111]/40 border border-stone-800/20 p-2 rounded-xl">',
    '<div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 bg-[#111111]/40 border border-stone-800/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">'
)

content = content.replace(
    '<div className="flex flex-col">',
    '<div className="flex flex-col items-center sm:items-start w-full sm:w-auto">'
)
content = content.replace(
    '<span className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold">',
    '<span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold text-center sm:text-left">'
)

content = content.replace(
    '<div className="flex flex-col items-end">',
    '<div className="flex flex-col items-center sm:items-end w-full sm:w-auto border-t sm:border-0 border-stone-800/30 pt-1.5 sm:pt-0">'
)
content = content.replace(
    '<span className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold mb-1">',
    '<span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold mb-1">'
)

# Quantity buttons
content = content.replace(
    'className="w-5 h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-[#0D3A35]/40 rounded"',
    'className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-[#0D3A35]/40 rounded"'
)
content = content.replace(
    '<span className="w-5 text-center font-mono text-[11px] font-bold text-[#FBF6F0] ">',
    '<span className="w-4 sm:w-5 text-center font-mono text-[10px] sm:text-[11px] font-bold text-[#FBF6F0] ">'
)

# 9. Action Buttons
content = content.replace(
    '<button\n              disabled\n              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-[#111111]/60 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"',
    '<button\n              disabled\n              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#111111]/60 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"'
)
content = content.replace(
    'className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${',
    'className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${'
)
content = content.replace(
    '<button\n              disabled\n              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-[#0B0A0A]/40 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"',
    '<button\n              disabled\n              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#0B0A0A]/40 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"'
)
content = content.replace(
    'className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-gold hover:bg-amber-400 text-[#111111]  font-bold shadow-md apple-liquid-btn"',
    'className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-gold hover:bg-amber-400 text-[#111111]  font-bold shadow-md apple-liquid-btn"'
)

# Extra fix for padding missing from initial replace due to format difference
# Actually I'll just write the entire content out
with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

