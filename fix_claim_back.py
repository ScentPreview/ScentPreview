import re

with open("src/App.tsx", "r") as f:
    content = f.read()

claim_close = '''        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity cursor-pointer font-mono text-xl"
        >
          ×
        </button>'''
        
new_claim_close = '''        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity cursor-pointer font-sans text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2"
        >
          <span>BACK TO STORE</span>
          <span className="text-xl leading-none">×</span>
        </button>'''

content = content.replace(claim_close, new_claim_close)

# Let's also check if they meant the button in the policy modal should say "GO BACK TO APPLICATION" or something? No, it says "file a claim go back into the application" - maybe they mean the claim form is currently taking over the whole screen?
# It's a modal over the application. So you can see the application in the background (backdrop-blur-sm).

with open("src/App.tsx", "w") as f:
    f.write(content)

