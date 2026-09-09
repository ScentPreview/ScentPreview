import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_grid = '''        {/* Brutalist Grid Layout */}
        {filteredCatalog.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent">
            {filteredCatalog.map((fragrance, index) => {
              return (
                <div key={fragrance.id} className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-black/5 p-2 transition-all hover:shadow-xl hover:shadow-black/5">
                  <ScentCard
                    fragrance={fragrance}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                onNoteClick={setSelectedNote}
                    fragranceStock={stock?.fragrances[fragrance.id]}
                  />
                </div>
              );
            })}
          </div>
        )}'''

new_grid = '''        {/* Brutalist Grid Layout - Categorized by Gender */}
        {filteredCatalog.length > 0 && (
          <div className="space-y-16">
            {/* Men's Collection */}
            {filteredCatalog.filter(f => f.gender === "Men").length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-serif text-black tracking-tight mb-6 flex items-center gap-4">
                  <span>MEN'S COLLECTION</span>
                  <div className="h-px bg-black/5 flex-1" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent">
                  {filteredCatalog.filter(f => f.gender === "Men").map((fragrance) => (
                    <div key={fragrance.id} className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-black/5 p-2 transition-all hover:shadow-xl hover:shadow-black/5">
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
            )}

            {/* Women's Collection */}
            {filteredCatalog.filter(f => f.gender === "Women").length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-serif text-black tracking-tight mb-6 flex items-center gap-4">
                  <span>WOMEN'S COLLECTION</span>
                  <div className="h-px bg-black/5 flex-1" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent">
                  {filteredCatalog.filter(f => f.gender === "Women").map((fragrance) => (
                    <div key={fragrance.id} className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-black/5 p-2 transition-all hover:shadow-xl hover:shadow-black/5">
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
            )}
          </div>
        )}'''

content = content.replace(old_grid, new_grid)

# Also update the best sellers list
old_best_sellers = '''{CATALOG_DATA.filter(f => ["lattafa-khamrah", "ck-one", "ck2", "givenchy-gentleman"].includes(f.id)).map((fragrance) => ('''
new_best_sellers = '''{CATALOG_DATA.filter(f => ["givenchy-gentleman", "zara-for-him-black", "lattafa-khamrah", "zara-rich-warm-addictive"].includes(f.id)).map((fragrance) => ('''
content = content.replace(old_best_sellers, new_best_sellers)

with open("src/App.tsx", "w") as f:
    f.write(content)
