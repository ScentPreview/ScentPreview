import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update the tabs background and styling to be clearer
old_tabs_container = '                  <div className="flex border-b border-stone-200 bg-stone-925">'
new_tabs_container = '                  <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto">'
content = content.replace(old_tabs_container, new_tabs_container)

# 2. Update active/inactive tab classes
old_active_tab = '? "border-amber-gold text-[#00A8E8] bg-[#FFFFFF]/40"'
new_active_tab = '? "border-stone-900 text-stone-900 bg-white font-bold"'
content = content.replace(old_active_tab, new_active_tab)

old_inactive_tab = ': "border-transparent text-black hover:text-black"'
new_inactive_tab = ': "border-transparent text-stone-500 hover:text-stone-900"'
content = content.replace(old_inactive_tab, new_inactive_tab)

# 3. Add Claims tab
old_prices_tab = '''                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("prices");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "prices"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Price Details
                    </button>'''

new_prices_tab = old_prices_tab + '''
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("claims");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 px-4 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                        adminActiveTab === "claims"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Refund Claims
                    </button>'''

content = content.replace(old_prices_tab, new_prices_tab)

with open("src/App.tsx", "w") as f:
    f.write(content)
