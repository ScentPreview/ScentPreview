import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# The incorrect claims tab chunk
incorrect_claims_tab = '''                    ) : (
                      /* Claims Tab */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-black/5">
                          <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-stone-500">
                            Shipping Complaints & Claims
                          </span>
                          <button
                            type="button"
                            onClick={fetchAdminComplaints}
                            className="inline-flex items-center gap-1.5 text-[10px] font-sans text-stone-500 hover:text-stone-900 transition-colors border border-black/5 hover:border-amber-700 px-2.5 py-1 bg-[#FFFFFF] cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Sync Claims
                          </button>
                        </div>
                        {adminComplaints.length === 0 ? (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-black/5 bg-[#FFFFFF]">
                            <span className="text-stone-500 text-xs font-sans uppercase tracking-[0.15em]">
                              No Claims Found
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {adminComplaints.map(claim => (
                              <div key={claim.id} className="border border-black/5 bg-[#FFFFFF] p-5 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-sm hover:border-stone-300">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-mono bg-stone-100 text-stone-900 px-2 py-0.5 rounded font-bold">
                                      {claim.id}
                                    </span>
                                    <span className="text-[10px] font-sans text-stone-400 uppercase tracking-widest">
                                      {new Date(claim.createdAt).toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${claim.status === "pending" ? "bg-amber-100 text-amber-800" : claim.status === "reviewed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                      {claim.status}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="block text-[9px] font-sans text-stone-500 uppercase tracking-widest mb-0.5">Buyer Details</span>
                                      <span className="block text-sm font-sans font-medium text-stone-900">{claim.buyerName}</span>
                                      <span className="block text-xs font-mono text-stone-600">{claim.email}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-sans text-stone-500 uppercase tracking-widest mb-0.5">Item Ordered</span>
                                      <span className="block text-sm font-serif italic text-stone-900">{claim.perfumeOrdered}</span>
                                    </div>
                                  </div>
                                </div>
                                {claim.imageProof && (
                                  <div className="shrink-0 w-32 h-32 bg-stone-100 rounded-xl overflow-hidden border border-black/5 shadow-inner">
                                    <img src={claim.imageProof} alt="Claim proof" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}'''

# Remove from the wrong place
content = content.replace(incorrect_claims_tab, "                    )}")

# Put it in the correct place after prices tab
# The real end of prices tab was also replaced by my script earlier?
# Wait, let's see if there is another claims tab currently.
content_claims_count = content.count("Shipping Complaints & Claims")
print("Claims tabs count:", content_claims_count)

if content_claims_count == 2:
    # Meaning my patch replaced BOTH occurrences!
    pass

# We can replace the last instance at the end of the admin ternary chain.
# But first let's just write this change and verify.
with open("src/App.tsx", "w") as f:
    f.write(content)

