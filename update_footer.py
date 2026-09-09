import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Using regex to replace the specific footer div
pattern = r'<div className="flex items-center gap-6 sm:gap-8">.*?India Edition\s*</span>\s*</div>'

new_footer = '''<div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-[10px] font-sans tracking-[0.15em] text-stone-500 uppercase">
              <button onClick={() => setPolicyModal("terms")} className="hover:text-amber-700 transition-colors cursor-pointer">Terms of Use</button>
              <button onClick={() => setPolicyModal("privacy")} className="hover:text-amber-700 transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => setPolicyModal("shipping")} className="hover:text-amber-700 transition-colors cursor-pointer">Shipping Policy</button>
              <button onClick={() => setPolicyModal("returns")} className="hover:text-amber-700 transition-colors cursor-pointer">Returns & Refunds</button>
            </div>
            <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setAdminPasscodeInput("");
                    setAdminPasscodeError(null);
                    setIsAdminOpen(true);
                  }}
                  className="text-[10px] font-sans text-stone-500 hover:text-amber-700 uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5 border border-black/5 rounded-full px-4 py-1.5 cursor-pointer shadow-sm"
                >
                  <Lock className="w-3 h-3" />
                  Admin Vault
                </button>
                <span className="text-[10px] font-sans text-stone-900 font-semibold uppercase tracking-[0.15em]">
                  India Edition
                </span>
            </div>
          </div>'''

content = re.sub(pattern, new_footer, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)

