import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Remove "Admin" from top header
old_header_admin = '''<button onClick={() => { setAdminPasscodeInput(""); setAdminPasscodeError(null); setIsAdminOpen(true); }} className="text-[11px] font-sans tracking-[0.15em] text-black hover:text-amber-700 transition-colors uppercase cursor-pointer">Admin</button>'''
new_header_admin = ''''''
content = content.replace(old_header_admin, new_header_admin)

# 2. Update footer to hide "Admin Vault" and make "India Edition" clickable
old_footer = '''                <button
                  onClick={() => {
                    setAdminPasscodeInput("");
                    setAdminPasscodeError(null);
                    setIsAdminOpen(true);
                  }}
                  className="text-[10px] font-sans text-black hover:text-amber-700 uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5 border border-black/5 rounded-full px-4 py-1.5 cursor-pointer shadow-sm"
                >
                  <Lock className="w-3 h-3" />
                  Admin Vault
                </button>
                <span className="text-[10px] font-sans text-black font-semibold uppercase tracking-[0.15em]">
                  India Edition
                </span>'''

new_footer = '''                <button 
                  onClick={() => {
                    setAdminPasscodeInput("");
                    setAdminPasscodeError(null);
                    setIsAdminOpen(true);
                  }}
                  className="text-[10px] font-sans text-black font-semibold uppercase tracking-[0.15em] cursor-pointer"
                >
                  India Edition
                </button>'''

content = content.replace(old_footer, new_footer)

with open("src/App.tsx", "w") as f:
    f.write(content)

