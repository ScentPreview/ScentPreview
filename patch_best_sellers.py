import re

with open("src/App.tsx", "r") as f:
    content = f.read()

best_sellers_jsx = '''
      {/* 1.5 Best Sellers Section */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-5 md:px-12 py-16">
        <div className="border-b border-stone-200/60 pb-5 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-amber-700 uppercase font-bold block mb-2">
              Top Tier
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-black tracking-tight">
              Best Sellers
            </h2>
          </div>
          <p className="text-black text-xs font-sans max-w-sm">
            Our most sought-after extractions. Verified crowd-pleasers with exceptional projection and longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATALOG_DATA.filter(f => ["lattafa-khamrah", "ck-one", "ck2", "givenchy-gentleman"].includes(f.id)).map((fragrance) => (
            <div key={fragrance.id} className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-amber-500/20 p-2 transition-all hover:shadow-xl hover:shadow-amber-500/10">
              <ScentCard
                fragrance={fragrance}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNoteClick={setSelectedNote}
                fragranceStock={stock?.fragrances[fragrance.id]}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Scent Grid: The Kinetic Catalog */}
'''

content = content.replace("{/* 2. Interactive Scent Grid: The Kinetic Catalog */}", best_sellers_jsx)

with open("src/App.tsx", "w") as f:
    f.write(content)
