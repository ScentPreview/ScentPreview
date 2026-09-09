import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the leftover `.00` chunk.
bad_str = ''')}.00
                          </span>
                          <span className="font-mono text-2xl font-medium text-[#00A8E8]">
                            ₹{spotlight.fixedPrice}.00
                          </span>
                        </div>
                      </div>
                      {stock && stock.bundles[spotlight.id] !== undefined && (
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FFFFFF]/60 border border-stone-850/40 rounded-full py-1.5 px-3.5 backdrop-blur-md">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                          </span>
                          <span className="text-[8px] font-mono font-semibold text-[#00A8E8] uppercase tracking-wider">
                            {stock.bundles[spotlight.id] === 0 ? "SOLD OUT" : `Only ${stock.bundles[spotlight.id]} sets left`}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleAddBundleToCart(spotlight)}
                          className="bg-white/[0.03]/10 hover:bg-white/[0.03]/20 border border-white/10 text-[#111111]  font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 px-5 transition-colors rounded-sm cursor-pointer"
                        >
                          Add to Box
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyBundleNow(spotlight)}
                          className="bg-white/[0.03] text-[#111111]  font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 px-6 hover:bg-[#276152] transition-colors rounded-sm cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* General Bento Cards */}
              {filteredBundles.filter((b) => !b.isSpotlight).map((bundle) => {
                const selectedSize = "5ml Normal";
                const price = bundle.prices ? bundle.prices[selectedSize] : 0;
                
                const bundleStock = stock ? stock.bundles[bundle.id] : undefined;
                const isBundleOutOfStock = bundle.isOutOfStock || bundleStock === 0;
                
                return (
                  <div 
                    key={bundle.id}
                    className={`lg:col-span-4 rounded-sm p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      isBundleOutOfStock 
                        ? "bg-white/[0.03] border border-[#E0E0E0]/60 grayscale opacity-60" 
                        : "bg-white/[0.03] border border-[#E0E0E0]/80 hover:border-amber-gold"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[9px] font-mono uppercase text-[#666666] tracking-wider">
                          Curated Set
                        </span>
                        
                        {isBundleOutOfStock && (
                          <span className="text-[8px] font-mono bg-white/[0.03] text-[#666666] border border-[#E0E0E0] px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-serif italic text-[#111111]  tracking-tight mb-2">
                        {bundle.name}
                      </h4>
                      <span className="block text-[10px] font-sans text-[#666666]">
                        Contains: {bundle.contains}
                      </span>
                    </div>
                    
                    <div className="mt-5 border-t border-stone-100 pt-5 flex items-center justify-between">
                      <div>
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-[#666666] mb-1">
                          Collection Price
                        </span>
                        
                        {isBundleOutOfStock ? (
                          <span className="font-mono text-sm font-semibold text-[#111111] ">—</span>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono text-[10px] text-[#666666] line-through">
                                ₹{getBundleOriginalPrice(bundle.id)}.00
                              </span>
                            </div>
                            <span className="font-mono text-sm font-bold text-[#111111] ">
                              ₹{price}.00
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddBundleToCart(bundle)}
                          disabled={isBundleOutOfStock}
                          className={`py-2 px-2.5 rounded-sm text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                            isBundleOutOfStock
                              ? "bg-white/[0.03] text-[#666666] border border-[#E0E0E0] cursor-not-allowed"
                              : "bg-white/[0.03] hover:bg-[#276152] text-stone-850 border border-[#E0E0E0]"
                          }`}
                        >
                          {isBundleOutOfStock ? "Unavailable" : "Add to Box"}
                        </button>
                        
                        {!isBundleOutOfStock && (
                          <button
                            type="button"
                            onClick={() => handleBuyBundleNow(bundle)}
                            className="py-2 px-3 rounded-sm text-[9px] font-mono tracking-wider uppercase bg-[#FFFFFF] hover:bg-black text-[#111111]  transition-colors cursor-pointer"
                          >
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}'''

if bad_str in content:
    content = content.replace(bad_str, ')}')
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find bad_str!")

