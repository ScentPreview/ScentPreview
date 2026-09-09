import re

with open("src/App.tsx", "r") as f:
    content = f.read()

claim_close_2 = '''            <button 
              onClick={onClose}
              className="mt-8 bg-[#111111] text-white px-10 py-4 font-mono text-xs tracking-[0.2em] uppercase font-medium hover:bg-stone-900 transition-colors"
            >
              CLOSE
            </button>'''
            
new_claim_close_2 = '''            <button 
              onClick={onClose}
              className="mt-8 bg-[#111111] text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 transition-colors shadow-xl shadow-black/10"
            >
              BACK TO STORE
            </button>'''

content = content.replace(claim_close_2, new_claim_close_2)

claim_close_3 = '''            <button 
              onClick={onClose}
              className="mt-8 bg-black text-white px-10 py-4 font-mono text-xs tracking-[0.2em] uppercase font-medium hover:bg-stone-900 transition-colors"
            >
              CLOSE
            </button>'''
            
new_claim_close_3 = '''            <button 
              onClick={onClose}
              className="mt-8 bg-black text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 transition-colors shadow-xl shadow-black/10"
            >
              BACK TO STORE
            </button>'''
            
content = content.replace(claim_close_3, new_claim_close_3)

with open("src/App.tsx", "w") as f:
    f.write(content)

