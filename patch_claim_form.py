import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Update signature
old_sig = '''const ClaimFormModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {'''
new_sig = '''const ClaimFormModal = ({ isOpen, onClose, availableSkus, onSubmitSuccess }: { isOpen: boolean, onClose: () => void, availableSkus: string[], onSubmitSuccess: () => void }) => {'''
content = content.replace(old_sig, new_sig)

# Update states and reset on close/submit
old_states = '''  const [perfumeOrdered, setPerfumeOrdered] = useState("");'''
new_states = '''  const [perfumeSize, setPerfumeSize] = useState("");'''
content = content.replace(old_states, new_states)

old_submit = '''    if (!buyerName || !email || !perfumeOrdered || !imageProof) {
      alert("All fields are required, including an image proof.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName, email, perfumeOrdered, imageProof })
      });
      setSubmitted(true);
    } catch (err) {'''
new_submit = '''    if (!buyerName || !email || !perfumeSize || !imageProof) {
      alert("All fields are required, including an image proof.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName, email, perfumeSize, imageProof })
      });
      
      // Clear form
      setBuyerName("");
      setEmail("");
      setPerfumeSize("");
      setImageProof("");
      
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {'''
content = content.replace(old_submit, new_submit)

# Update success view
old_success = '''        {submitted ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-serif italic text-black">Claim Submitted</h2>
            <p className="text-sm font-sans tracking-widest uppercase text-black">
              Your claim is under review. You will be contacted via email.
            </p>
            <button 
              onClick={onClose}
              className="mt-8 bg-[#111111] text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 transition-colors shadow-xl shadow-black/10"
            >
              BACK TO STORE
            </button>
          </div>
        ) : ('''
new_success = '''        {submitted ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-emerald-100 border border-emerald-500 rounded-lg">
               <span className="block font-mono text-[10px] md:text-xs tracking-widest uppercase font-bold text-emerald-900 mb-2">
                 [ CLAIM REGISTERED: REVIEWING WITHIN 48 HOUR WINDOW ]
               </span>
            </div>
            <h2 className="text-3xl font-serif italic text-black">Claim Submitted</h2>
            <p className="text-sm font-sans tracking-widest uppercase text-black">
              Your claim is under review. You will be contacted via email.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-8 bg-[#111111] text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 transition-colors shadow-xl shadow-black/10"
            >
              BACK TO STORE
            </button>
          </div>
        ) : ('''
content = content.replace(old_success, new_success)

# Update form field
old_perfume = '''              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 03. PERFUME ORDERED ]
                </label>
                <input 
                  type="text"
                  value={perfumeOrdered}
                  onChange={e => setPerfumeOrdered(e.target.value)}
                  placeholder="e.g. Baccarat Rouge 540 Extrait"
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                />
              </div>'''
new_perfume = '''              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 03. PERFUME & SIZE ]
                </label>
                <select
                  value={perfumeSize}
                  onChange={e => setPerfumeSize(e.target.value)}
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                >
                  <option value="" disabled>Select from available in-stock SKUs...</option>
                  {availableSkus.map(sku => (
                    <option key={sku} value={sku}>{sku}</option>
                  ))}
                </select>
              </div>'''
content = content.replace(old_perfume, new_perfume)

with open("src/App.tsx", "w") as f:
    f.write(content)

