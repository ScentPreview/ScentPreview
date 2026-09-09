import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                                    <span className="text-[10px] font-sans text-white uppercase tracking-widest">
                                      {new Date(claim.createdAt).toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${claim.status === "pending" ? "bg-amber-100 text-amber-800" : claim.status === "reviewed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                      {claim.status}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="block text-[9px] font-sans text-black uppercase tracking-widest mb-0.5">Buyer Details</span>
                                      <span className="block text-sm font-sans font-medium text-black">{claim.buyerName}</span>
                                      <span className="block text-xs font-mono text-black">{claim.email}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-sans text-black uppercase tracking-widest mb-0.5">Item Ordered</span>
                                      <span className="block text-sm font-serif italic text-black">{claim.perfumeOrdered}</span>
                                    </div>
                                  </div>
                                </div>
                                {claim.imageProof && (
                                  <div className="shrink-0 w-32 h-32 bg-stone-100 rounded-xl overflow-hidden border border-black/5 shadow-inner">
                                    <img src={claim.imageProof} alt="Claim proof" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>'''

replacement = '''                                    <span className="text-[10px] font-sans text-black/60 uppercase tracking-widest">
                                      {new Date(claim.createdAt).toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${claim.status === "pending" ? "bg-amber-100 text-amber-800" : claim.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                      {claim.status}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest mb-0.5">Buyer Details</span>
                                      <span className="block text-sm font-sans font-medium text-black">{claim.buyerName}</span>
                                      <span className="block text-xs font-mono text-black">{claim.email}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest mb-0.5">Item Ordered</span>
                                      <span className="block text-sm font-serif italic text-black">{claim.perfumeOrdered}</span>
                                    </div>
                                  </div>
                                  {claim.status === "pending" && (
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4 pt-4 border-t border-black/5">
                                      <button
                                        onClick={() => updateClaimStatus(claim.id, "approved")}
                                        className="flex-1 bg-[#111111] hover:bg-[#1A1A1A] text-white py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                      >
                                        APPROVE (DISPATCH FEE REQUIRED)
                                      </button>
                                      <button
                                        onClick={() => updateClaimStatus(claim.id, "rejected")}
                                        className="flex-1 bg-[#FFFFFF] hover:bg-red-50 text-red-600 border border-red-200 py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                      >
                                        REJECT CLAIM
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {claim.imageProof && (
                                  <div className="shrink-0 w-32 h-32 bg-stone-100 rounded-xl overflow-hidden border border-black/5 shadow-inner">
                                    <a href={claim.imageProof} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                      <img src={claim.imageProof} alt="Claim proof" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                                    </a>
                                  </div>
                                )}
                              </div>'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

