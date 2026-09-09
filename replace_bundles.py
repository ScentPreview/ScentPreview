import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the whole section from {/* Curated Capsule Bundles Subsection */} down to its closing </div>
new_bundles = """        {/* Curated Capsule Bundles Subsection */}
        {filteredBundles.length > 0 && (
          <div className="mt-16">
            {/* Subsection Heading */}
            <div className="border-t border-[#111111] py-4 mb-8">
              <span className="text-[10px] font-mono tracking-widest text-[#111111] uppercase font-bold">
                [ BUNDLE CAPSULES ]
              </span>
              <h3 className="text-4xl font-sans font-black text-[#111111] uppercase tracking-tighter mt-2">
                UNIFIED DECANT SETS
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111111] border border-[#111111]">
              {filteredBundles.map((bundle) => {
                const selectedSize = "5ml Normal";
                const isSpotlight = bundle.isSpotlight;
                const price = isSpotlight ? bundle.fixedPrice : (bundle.prices ? bundle.prices[selectedSize] : 0);
                const originalPrice = isSpotlight ? getBundleOriginalPrice(bundle.id) : null;
                const bundleStock = stock ? stock.bundles[bundle.id] : undefined;
                const isBundleOutOfStock = bundle.isOutOfStock || bundleStock === 0;

                return (
                  <div 
                    key={bundle.id}
                    className={`bg-[#F4F4F2] p-6 flex flex-col justify-between ${isSpotlight ? 'md:col-span-2' : ''}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[9px] font-mono uppercase text-[#111111] tracking-widest border border-[#111111] px-1.5 py-0.5">
                          {isSpotlight ? "SPOTLIGHT" : "CURATED"}
                        </span>
                        {isBundleOutOfStock && (
                          <span className="text-[9px] font-mono text-[#111111] tracking-widest uppercase">
                            [ SOLD OUT ]
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold font-sans text-[#111111] uppercase tracking-tighter mb-2">
                        {bundle.name}
                      </h3>
                      <p className="text-[10px] font-mono tracking-widest text-[#666666] uppercase mb-4 leading-relaxed">
                        CONTAINS: {bundle.contains}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-[#111111] pt-4 flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-mono uppercase text-[#111111] tracking-widest">
                          {isSpotlight ? "FIXED PRICE" : "SET PRICE"}
                        </span>
                        <div className="text-right">
                          {originalPrice && (
                            <span className="block font-mono text-[10px] text-[#666666] line-through">
                              ₹{originalPrice}
                            </span>
                          )}
                          <span className="font-mono text-xl font-bold text-[#111111]">
                            ₹{price}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={isBundleOutOfStock}
                          onClick={() => handleAddBundleToCart(bundle)}
                          className="py-3 border border-[#111111] text-[9px] font-mono uppercase tracking-widest font-bold text-[#111111] hover:bg-[#111111] hover:text-[#F4F4F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          ADD TO CART
                        </button>
                        <button
                          disabled={isBundleOutOfStock}
                          onClick={() => handleBuyBundleNow(bundle)}
                          className="py-3 bg-[#111111] text-[#F4F4F2] text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-[#0E0E0E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}"""

content = re.sub(
    r'\{\/\* Curated Capsule Bundles Subsection \*\/\}[\s\S]*?\{filteredBundles\.length > 0 && \([\s\S]*?<div className="mt-24 pt-16[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)',
    new_bundles,
    content
)

with open("src/App.tsx", "w") as f:
    f.write(content)

