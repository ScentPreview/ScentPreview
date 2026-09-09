import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add organic ambient background glows back
content = content.replace('<div className="min-h-screen bg-transparent text-[#111111]  font-sans relative  selection:bg-[#276152] selection:text-[#111111] ">',
'''<div className="min-h-screen bg-[#F7F7F5] text-[#111111] font-sans relative selection:bg-amber-100 selection:text-black">
      {/* Organic Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/[0.03] blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-stone-500/[0.03] blur-[120px] pointer-events-none z-0"></div>''')

# Soften some remaining brutalist hard borders
content = content.replace('bg-[#111111] hover:bg-[#111111] hover:text-[#F4F4F2] text-[#F4F4F2] transition-colors px-8 py-4 text-xs font-sans tracking-[0.2em] uppercase font-medium cursor-pointer flex items-center justify-center gap-2.5 border border-[#111111]', 
'bg-[#111111] hover:bg-[#1A1A1A] text-[#F4F4F2] transition-all duration-300 px-8 py-4 rounded-full text-[11px] font-sans tracking-[0.2em] uppercase font-medium cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-black/10')

# Hero changes - softer borders, organic text
content = content.replace('className="w-full flex items-stretch h-14"', 'className="w-full flex items-stretch h-20 px-4 max-w-7xl mx-auto"')
content = content.replace('className="flex-1 flex items-center px-6 border-r border-black/5"', 'className="flex-1 flex items-center px-6"')
content = content.replace('className="hidden md:flex flex-1 items-center justify-center border-r border-black/5 gap-8"', 'className="hidden md:flex flex-1 items-center justify-center gap-10"')
content = content.replace('text-[10px] font-sans tracking-[0.2em] text-[#111111] uppercase hover:underline cursor-pointer', 'text-[11px] font-sans tracking-[0.15em] text-[#111111] hover:text-amber-700 transition-colors uppercase cursor-pointer')
content = content.replace('className="flex-1 flex items-center justify-end px-0 relative"', 'className="flex-1 flex items-center justify-end px-6 relative"')
content = content.replace('className="w-full h-full bg-transparent px-6 text-[10px] font-sans tracking-[0.2em] text-[#111111] uppercase focus:outline-none placeholder:text-[#666666]"', 'className="w-full h-full bg-transparent px-6 text-[11px] font-sans tracking-[0.15em] text-[#111111] focus:outline-none placeholder:text-stone-400"')
content = content.replace('className="h-full px-6 border-l border-black/5 text-[10px] font-sans tracking-[0.2em] text-[#111111] hover:bg-[#111111] hover:text-[#F4F4F2] uppercase transition-colors whitespace-nowrap cursor-pointer"', 'className="h-full px-6 flex items-center text-[11px] font-sans tracking-[0.15em] text-[#111111] hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer"')
content = content.replace('className="w-full border-b border-black/5 flex flex-col md:flex-row bg-[#F4F4F2] min-h-[70vh]"', 'className="w-full max-w-7xl mx-auto flex flex-col md:flex-row min-h-[75vh] mt-4"')
content = content.replace('className="flex-1 border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-between p-8 md:p-16"', 'className="flex-1 flex flex-col justify-center p-8 md:p-16 relative z-10"')
content = content.replace('className="flex-1 bg-[#111111] relative overflow-hidden group min-h-[300px]"', 'className="flex-1 relative overflow-hidden group min-h-[400px] rounded-3xl shadow-2xl shadow-stone-300/50"')
content = content.replace('border border-[#111111]', '')
content = content.replace('text-[10px] font-sans tracking-[0.2em] text-[#111111] uppercase border px-2 py-1 mb-8 inline-block', 'text-[11px] font-sans tracking-[0.2em] text-[#111111] uppercase border border-stone-300 rounded-full px-4 py-1.5 mb-8 inline-block shadow-sm')
content = content.replace('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111111]', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent max-w-7xl mx-auto px-6')

# Swap hard catalog backgrounds to softer cards
content = content.replace('className="bg-[#F4F4F2]"', 'className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-black/5 p-2 transition-all hover:shadow-xl hover:shadow-black/5"')

with open("src/App.tsx", "w") as f:
    f.write(content)

