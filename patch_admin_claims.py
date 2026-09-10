import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the claim mapping in Admin tab
old_claim_map = """                            {adminComplaints.map(claim => (
                              <div key={claim.id} className="border border-black/5 bg-[#FFFFFF] p-5 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-sm hover:border-stone-300">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-mono bg-stone-100 text-black px-2 py-0.5 rounded font-bold">
                                      {claim.id}
                                    </span>
                                    <span className="text-[10px] font-sans text-black/60 uppercase tracking-widest">
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
                                      <span className="block text-sm font-sans font-bold text-black">{claim.perfumeOrdered}</span>
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
                              </div>
                            ))}"""

new_claim_map = """                            {adminComplaints.map(claim => {
                              const submittedTime = new Date(claim.submittedAt || claim.createdAt).getTime();
                              const isExpired = (Date.now() - submittedTime) > 48 * 60 * 60 * 1000;
                              return (
                              <div key={claim.id} className="border border-black/5 bg-[#FFFFFF] p-5 rounded-2xl flex flex-col justify-between gap-6 shadow-sm hover:border-stone-300">
                                <div className="space-y-3 flex-1">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[11px] font-mono bg-stone-100 text-black px-2 py-0.5 rounded font-bold">
                                      {claim.id}
                                    </span>
                                    <span className="text-[10px] font-sans text-black/60 uppercase tracking-widest">
                                      {new Date(claim.submittedAt || claim.createdAt).toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${claim.status === "pending" ? "bg-amber-100 text-amber-800" : claim.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                      {claim.status}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isExpired ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                                      {isExpired ? "SLA EXPIRED (>48H)" : "VALID SLA (≤48H)"}
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
                                      <span className="block text-sm font-sans font-bold text-black">{claim.perfumeAndSize || claim.perfumeOrdered}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest">Attached Proof</span>
                                  {(claim.proofImage || claim.imageProof) ? (
                                    <div className="w-full">
                                      <a href={claim.proofImage || claim.imageProof} target="_blank" rel="noreferrer" className="block text-xs font-bold font-sans text-amber-700 hover:underline mb-2 uppercase tracking-widest">
                                        View Full Image
                                      </a>
                                      <img 
                                        src={claim.proofImage || claim.imageProof} 
                                        alt="Claim Proof" 
                                        className="w-full max-h-64 object-contain rounded border border-neutral-700 bg-black" 
                                        onError={(e) => { e.currentTarget.src=''; e.currentTarget.alt='Invalid or Corrupted Image'; }}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-xs font-mono text-stone-500 italic">No image provided</span>
                                  )}
                                </div>
                                
                                {claim.status === "pending" && (
                                  <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4 pt-4 border-t border-black/5">
                                    <button
                                      onClick={() => updateClaimStatus(claim.id, "approved")}
                                      className="flex-1 bg-[#111111] hover:bg-[#1A1A1A] text-white py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                    >
                                      APPROVE REPLACEMENT (CHARGE RE-DISPATCH FEE)
                                    </button>
                                    <button
                                      onClick={() => updateClaimStatus(claim.id, "rejected")}
                                      className="flex-1 bg-[#FFFFFF] hover:bg-red-50 text-red-600 border border-red-200 py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                    >
                                      REJECT CLAIM (PAST 48-HOUR MARK)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )});}"""

content = content.replace(old_claim_map, new_claim_map)

with open("src/App.tsx", "w") as f:
    f.write(content)
