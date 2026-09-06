import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# 1. Padding
content = content.replace(
    'p-3 sm:p-5 flex flex-col justify-between',
    'p-4 sm:p-5 flex flex-col justify-between'
)

# 2. Original Price & Label
content = content.replace(
    '<span className="text-[9px] sm:text-[10px] text-[#B1B7AB]/90 line-through font-normal">',
    '<span className="text-[10px] text-[#B1B7AB]/90 line-through font-normal">'
)
content = content.replace(
    '<span className="text-[7px] sm:text-[8px] text-[#B1B7AB]/90 font-sans uppercase tracking-widest font-bold">',
    '<span className="text-[8px] sm:text-[9px] text-[#B1B7AB]/90 font-sans uppercase tracking-widest font-bold">'
)
content = content.replace(
    '<span className="text-xs sm:text-sm font-bold text-[#FBF6F0] ">',
    '<span className="text-sm sm:text-base font-bold text-[#FBF6F0] ">'
)

# 3. Brand & Badges
content = content.replace(
    '<span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] text-[#B1B7AB]/90 font-semibold">',
    '<span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-[#B1B7AB]/90 font-semibold">'
)
content = content.replace(
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#276152] text-[#FBF6F0] border border-[#0D3A35] text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm">',
    '<span className="inline-flex items-center gap-1 bg-[#276152] text-[#FBF6F0] border border-[#0D3A35] text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">'
)
content = content.replace(
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-stone-900/60 border border-stone-700 text-[#B1B7AB] text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm font-bold">',
    '<span className="inline-flex items-center gap-1 bg-stone-900/60 border border-stone-700 text-[#B1B7AB] text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm font-bold">'
)
content = content.replace(
    '<span className="inline-flex items-center gap-0.5 sm:gap-1 bg-red-950/40 border border-red-900/50 text-red-400 text-[7px] sm:text-[8px] font-mono uppercase tracking-widest px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full shadow-sm font-bold animate-pulse">',
    '<span className="inline-flex items-center gap-1 bg-red-950/40 border border-red-900/50 text-red-400 text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm font-bold animate-pulse">'
)

# 4. Product Title
content = content.replace(
    '<h3 className="text-base sm:text-lg font-serif italic text-[#FBF6F0] leading-tight tracking-tight mb-1.5 sm:mb-2">',
    '<h3 className="text-lg sm:text-xl font-serif italic text-[#FBF6F0] leading-tight tracking-tight mb-2">'
)

# 5. Scent Notes
content = content.replace(
    'className="text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-[2px] sm:py-0.5 border border-stone-800/60 rounded-full font-mono font-medium tracking-wider transition-colors text-[#FBF6F0] bg-[#111111]/90 hover:bg-[#276152]/80 hover:border-[#276152] shadow-sm"',
    'className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 border border-stone-800/60 rounded-full font-mono font-medium tracking-wider transition-colors text-[#FBF6F0] bg-[#111111]/90 hover:bg-[#276152]/80 hover:border-[#276152] shadow-sm"'
)

# 6. Select Volume Label
content = content.replace(
    '<span className="block text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-[#B1B7AB] mb-1.5 sm:mb-2">',
    '<span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#B1B7AB] mb-2">'
)

# 7. Size Buttons
content = content.replace(
    'className={`relative py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-mono rounded-md sm:rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${',
    'className={`relative py-1.5 text-[9px] sm:text-[10px] font-mono rounded-md sm:rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${'
)

# 8. Subtotal Price
content = content.replace(
    '<span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold text-center sm:text-left">',
    '<span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold text-center sm:text-left">'
)
content = content.replace(
    '<span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold mb-1">',
    '<span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold mb-1">'
)

# 9. Quantity Selector
content = content.replace(
    'className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-[#0D3A35]/40 rounded"',
    'className="w-5 h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs sm:text-sm font-semibold hover:bg-[#0D3A35]/40 rounded"'
)
content = content.replace(
    '<span className="w-4 sm:w-5 text-center font-mono text-[10px] sm:text-[11px] font-bold text-[#FBF6F0] ">',
    '<span className="w-5 text-center font-mono text-[11px] sm:text-xs font-bold text-[#FBF6F0] ">'
)

# 10. Action Buttons
content = content.replace(
    '<button\n              disabled\n              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#111111]/60 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"',
    '<button\n              disabled\n              className="w-full py-2.5 px-3 rounded-xl text-[10px] sm:text-[11px] font-mono tracking-widest uppercase bg-[#111111]/60 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"'
)
content = content.replace(
    'className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${',
    'className={`w-full py-2.5 px-3 rounded-xl text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${'
)
content = content.replace(
    '<button\n              disabled\n              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#0B0A0A]/40 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"',
    '<button\n              disabled\n              className="w-full py-2.5 px-3 rounded-xl text-[10px] sm:text-[11px] font-mono tracking-widest uppercase bg-[#0B0A0A]/40 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"'
)
content = content.replace(
    'className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-gold hover:bg-amber-400 text-[#111111]  font-bold shadow-md apple-liquid-btn"',
    'className="w-full py-2.5 px-3 rounded-xl text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-gold hover:bg-amber-400 text-[#111111]  font-bold shadow-md apple-liquid-btn"'
)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

