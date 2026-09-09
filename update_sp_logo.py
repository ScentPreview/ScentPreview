import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Update Nav Logo
content = content.replace(
'''            <span className="text-xl font-sans font-bold text-black uppercase tracking-tighter">
              ScentPreview
            </span>''',
'''            <span className="text-2xl font-serif italic font-bold text-black tracking-tight">
              SP 0.2
            </span>'''
)

# Update Footer Logo
content = content.replace(
'''            <span className="text-xs font-mono tracking-[0.3em] text-black  uppercase font-bold">
              ScentPreview
            </span>''',
'''            <span className="text-xl font-serif italic text-black font-bold">
              SP 0.2
            </span>'''
)

# Update Payment modal Logo
content = content.replace(
'''                  <span className="text-xs font-mono tracking-[0.3em] font-bold text-black  uppercase">
                    ScentPreview
                  </span>''',
'''                  <span className="text-base font-serif italic font-bold text-black tracking-tight">
                    SP 0.2
                  </span>'''
)

with open("src/App.tsx", "w") as f:
    f.write(content)

