import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                          <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-black">
                            Shipping Complaints & Claims
                          </span>'''
                          
replacement = '''                          <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-black font-bold">
                            [ ADMIN / REGISTERED CLAIMS ]
                          </span>'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

