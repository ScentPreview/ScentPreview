import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Replace the top bar of ScentCard
# from:
#      <div className="flex items-center justify-between border-b border-black/5 p-3 uppercase font-sans text-[10px] tracking-widest text-black">
#        <span>[ {fragrance.id} ]</span>
#        <span>{fragrance.type}</span>
#      </div>
# to nothing, because the title inside will handle it.
content = re.sub(
    r'<div className="flex items-center justify-between border-b border-black/5 p-3 uppercase font-sans text-\[10px\] tracking-widest text-black">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# Update the main body
# from:
#        <h3 className="text-2xl font-sans font-bold text-black text-black tracking-tighter uppercase mb-1 leading-none">{fragrance.name}</h3>
#        <p className="text-[10px] font-sans tracking-[0.15em] text-black/60 uppercase mb-4">{fragrance.brand}</p>
#        
#        <p className="text-xs font-sans font-light leading-relaxed text-black mb-6 flex-1">
#          {fragrance.description}
#        </p>
#        <div className="space-y-3 mb-6">
#          <div className="flex flex-wrap gap-1">
#            {fragrance.notesList.map((note) => (
# ...

new_body = '''        <h3 className="text-2xl font-sans font-bold text-black uppercase mb-3 leading-none tracking-tight">{fragrance.name}</h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <p className="text-[11px] font-mono font-medium text-black uppercase tracking-wider">
            Notes: {fragrance.notes}
          </p>
          <p className="text-[11px] font-sans text-black leading-relaxed">
            Profile: {fragrance.description}
          </p>
          <p className="text-[11px] font-mono font-medium text-black uppercase tracking-wider">
            Tag: [ {fragrance.type} ]
          </p>
        </div>'''

content = re.sub(
    r'<h3 className="text-2xl font-sans font-bold text-black text-black tracking-tighter uppercase mb-1 leading-none">\{fragrance\.name\}</h3>.*?</div>\s*</div>',
    new_body,
    content,
    flags=re.DOTALL
)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)
