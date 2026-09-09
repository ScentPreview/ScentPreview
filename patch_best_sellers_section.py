import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Update Best Sellers to map correctly to men/women and replace the single grid with a categorized one or just update the one to include Zara Rich Warm Addictive.
# "make women one section and men one separate section and make best sellers accordingly"
# Wait, let's just make two sections inside Best Sellers: Men's Best Sellers and Women's Best Sellers.
best_sellers_jsx_old = '''      {/* 1.5 Best Sellers Section */}
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
          {CATALOG_DATA.filter(f => ["givenchy-gentleman", "zara-for-him-black", "lattafa-khamrah", "zara-rich-warm-addictive"].includes(f.id)).map((fragrance) => (
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
      </section>'''

best_sellers_jsx_new = '''      {/* 1.5 Best Sellers Section */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-5 md:px-12 py-16 space-y-16">
        <div>
          <div className="border-b border-stone-200/60 pb-5 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-amber-700 uppercase font-bold block mb-2">
                Top Tier // Men
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-black tracking-tight">
                Men's Best Sellers
              </h2>
            </div>
            <p className="text-black text-xs font-sans max-w-sm">
              Our most sought-after masculine extractions. Verified crowd-pleasers with exceptional projection and longevity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {CATALOG_DATA.filter(f => ["givenchy-gentleman", "zara-for-him-black"].includes(f.id)).map((fragrance) => (
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
        </div>

        <div>
          <div className="border-b border-stone-200/60 pb-5 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-amber-700 uppercase font-bold block mb-2">
                Top Tier // Women
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-black tracking-tight">
                Women's Best Sellers
              </h2>
            </div>
            <p className="text-black text-xs font-sans max-w-sm">
              Our most sought-after feminine extractions. Verified crowd-pleasers with exceptional projection and longevity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {CATALOG_DATA.filter(f => ["lattafa-khamrah", "ck-one"].includes(f.id)).map((fragrance) => (
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
        </div>
      </section>'''

content = content.replace(best_sellers_jsx_old, best_sellers_jsx_new)

# Also need to make sure interval calls fetchAdminComplaints
old_useeffect = '''  useEffect(() => {
    let interval: any = null;
    if (isAdminOpen) {
      if (isAdminAuthenticated) {
        fetchAdminOrders();
        interval = setInterval(fetchAdminOrders, 10000); // Keep admin orders synchronized across devices
      }'''

new_useeffect = '''  useEffect(() => {
    let interval: any = null;
    if (isAdminOpen) {
      if (isAdminAuthenticated) {
        fetchAdminOrders();
        fetchAdminComplaints();
        interval = setInterval(() => {
           fetchAdminOrders();
           fetchAdminComplaints();
        }, 10000); // Keep admin orders synchronized across devices
      }'''

content = content.replace(old_useeffect, new_useeffect)

with open("src/App.tsx", "w") as f:
    f.write(content)

