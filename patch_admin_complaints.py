import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add the button to the header of the admin tab list
admin_tabs = '''                    <button
                      onClick={() => {
                        setAdminActiveTab("prices");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "prices"
                          ? "border-amber-gold text-[#00A8E8] bg-[#FFFFFF]/40"
                          : "border-transparent text-stone-500 hover:text-stone-500"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Price Engine</span>
                    </button>'''

new_admin_tabs = admin_tabs + '''
                    <button
                      onClick={() => {
                        setAdminActiveTab("claims");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "claims"
                          ? "border-red-500 text-red-500 bg-red-500/5"
                          : "border-transparent text-stone-500 hover:text-stone-500"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Claims</span>
                    </button>'''

if 'setAdminActiveTab("claims");' not in content:
    content = content.replace(admin_tabs, new_admin_tabs)

# Modify the end of the ternary logic to support "claims"
prices_tab_start = '''                    ) : (
                      /* Prices tab */
                      <div className="space-y-6 max-w-4xl mx-auto">'''

prices_tab_start_new = '''                    ) : adminActiveTab === "prices" ? (
                      /* Prices tab */
                      <div className="space-y-6 max-w-4xl mx-auto">'''
                      
content = content.replace(prices_tab_start, prices_tab_start_new)

# Find the end of prices tab
end_of_prices_tab = '''                        </div>
                      </div>
                    )}'''

claims_tab_code = '''                        </div>
                      </div>
                    ) : (
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

if 'Shipping Complaints & Claims' not in content:
    content = content.replace(end_of_prices_tab, claims_tab_code)

with open("src/App.tsx", "w") as f:
    f.write(content)

