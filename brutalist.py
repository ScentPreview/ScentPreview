import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Fix the Sensory Test CTA
bad_cta = 'bg-gradient-to-r from-stone-900 via-stone-950 to-neutral-900 text-[#111111]  rounded-2xl p-6 sm:p-8 border border-[#E0E0E0] shadow-xl overflow-hidden relative group'
good_cta = 'bg-[#F4F4F2] text-[#111111] p-6 sm:p-8 border border-[#111111] overflow-hidden relative group mb-16'
content = content.replace(bad_cta, good_cta)

bad_btn = 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-[#111111] transition-all duration-300 px-8 py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 border border-amber-400/20'
good_btn = 'bg-[#111111] hover:bg-[#000000] text-[#F4F4F2] transition-colors px-8 py-4 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2.5 border border-[#111111]'
content = content.replace(bad_btn, good_btn)

# Remove shadow-xl, shadow-2xl, shadow-md, rounded-xl, rounded-2xl, rounded-md, rounded-sm globally where they conflict with brutalist
content = content.replace("shadow-xl", "")
content = content.replace("shadow-2xl", "")
content = content.replace("shadow-lg", "")
content = content.replace("shadow-md", "")
content = content.replace("shadow-sm", "")
content = content.replace("rounded-3xl", "")
content = content.replace("rounded-2xl", "")
content = content.replace("rounded-xl", "")
content = content.replace("rounded-md", "")
content = content.replace("rounded-sm", "")
content = content.replace("rounded-lg", "")
content = content.replace("rounded", "")

with open("src/App.tsx", "w") as f:
    f.write(content)

