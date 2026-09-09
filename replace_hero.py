import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# We want to replace from `<header className="sticky top-0` down to `</div></section>`
with open("hero_header.txt", "r") as f:
    old_hero_header = f.read()

new_hero_header = """      <header className="sticky top-0 bg-[#F4F4F2] z-40 border-b border-[#111111]">
        <nav className="w-full flex items-stretch h-14">
          <div className="flex-1 flex items-center px-6 border-r border-[#111111]">
            <span className="text-xl font-sans font-bold text-[#111111] uppercase tracking-tighter">
              ByScent
            </span>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center border-r border-[#111111] gap-8">
            <button onClick={scrollToCatalog} className="text-[10px] font-mono tracking-widest text-[#111111] uppercase hover:underline cursor-pointer">Archive</button>
            <button onClick={() => { setAdminPasscodeInput(""); setAdminPasscodeError(null); setIsAdminOpen(true); }} className="text-[10px] font-mono tracking-widest text-[#111111] uppercase hover:underline cursor-pointer">Admin</button>
          </div>
          <div className="flex-1 flex items-center justify-end px-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  document.getElementById("kinetic-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              placeholder="SEARCH..."
              className="w-full h-full bg-transparent px-6 text-[10px] font-mono tracking-widest text-[#111111] uppercase focus:outline-none placeholder:text-[#666666]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-32 text-[#111111] font-mono text-sm px-2 cursor-pointer"
              >
                ×
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="h-full px-6 border-l border-[#111111] text-[10px] font-mono tracking-widest text-[#111111] hover:bg-[#111111] hover:text-[#F4F4F2] uppercase transition-colors whitespace-nowrap cursor-pointer"
            >
              CART ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </button>
          </div>
        </nav>
      </header>

      {/* Brutalist Hero Section */}
      <section className="w-full border-b border-[#111111] flex flex-col md:flex-row bg-[#F4F4F2] min-h-[70vh]">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-[#111111] flex flex-col justify-between p-8 md:p-16">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#111111] uppercase border border-[#111111] px-2 py-1 mb-8 inline-block">
              [ EDITION 2026 ]
            </span>
            <h1 className="text-6xl md:text-9xl font-sans font-black text-[#111111] uppercase tracking-tighter leading-[0.8] mb-6">
              SCENT<br />ARCHIVE
            </h1>
          </div>
          <div className="max-w-sm mt-12 md:mt-0">
            <p className="text-xs font-sans text-[#111111] leading-relaxed mb-8">
              CURATED PREMIUM FRAGRANCE DECANTS. HAND-POURED, PERFECTLY MEASURED, AND DELIVERED DIRECTLY TO YOUR DOOR.
            </p>
            <button
              onClick={scrollToCatalog}
              className="border border-[#111111] px-6 py-4 text-[10px] font-mono tracking-widest text-[#111111] hover:bg-[#111111] hover:text-[#F4F4F2] transition-colors uppercase w-full sm:w-auto cursor-pointer"
            >
              EXPLORE CATALOG
            </button>
          </div>
        </div>
        <div className="flex-1 bg-[#111111] p-8 md:p-16 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-8 left-8">
             <span className="text-[9px] font-mono tracking-widest text-[#F4F4F2] uppercase opacity-50">
               FEATURED STAGE
             </span>
          </div>
          <div className="w-full max-w-sm">
             <InteractiveBottle />
          </div>
        </div>
      </section>\n"""

content = content.replace(old_hero_header, new_hero_header)

with open("src/App.tsx", "w") as f:
    f.write(content)
