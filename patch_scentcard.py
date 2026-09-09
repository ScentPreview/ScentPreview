import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Make it organic luxury style, and enforce the black/white font constraint
content = content.replace('bg-[#F4F4F2]', 'bg-[#FFFFFF] border border-black/5 shadow-sm rounded-3xl overflow-hidden')
content = content.replace('border-b border-[#111111]', 'border-b border-black/5')
content = content.replace('border border-[#111111]', 'border border-black/5 rounded-2xl overflow-hidden')
content = content.replace('border-r border-[#111111]', 'border-r border-black/5')
content = content.replace('border-l border-[#111111]', 'border-l border-black/5')
content = content.replace('bg-[#111111]', 'bg-black')
content = content.replace('text-[#111111]', 'text-black')
content = content.replace('text-[#F4F4F2]', 'text-white')
content = content.replace('text-[#666666]', 'text-black/60')
content = content.replace('hover:bg-[#111111]', 'hover:bg-black')
content = content.replace('hover:text-[#F4F4F2]', 'hover:text-white')
content = content.replace('hover:bg-[#E0E0E0]', 'hover:bg-black/5')
content = content.replace('bg-[#E0E0E0]', 'bg-black/5')

# Typography updates
content = content.replace('font-mono text-[9px]', 'font-sans text-[10px]')
content = content.replace('text-2xl font-bold font-sans', 'text-2xl font-serif italic text-black')
content = content.replace('font-mono tracking-widest', 'font-sans tracking-[0.15em]')
content = content.replace('font-mono uppercase', 'font-sans uppercase')
content = content.replace('font-mono text-[11px]', 'font-sans text-[11px]')
content = content.replace('font-mono text-sm', 'font-sans text-sm')
content = content.replace('font-mono text-xs', 'font-sans text-xs')
content = content.replace('font-mono text-lg', 'font-sans text-lg')
content = content.replace('font-mono', 'font-sans')

# Out of stock UI replacement
buttons = '''        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="py-3 border border-black/5 rounded-2xl overflow-hidden text-[10px] font-sans uppercase tracking-[0.15em] font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {added ? <Check className="w-3 h-3" /> : null}
            {added ? "ADDED" : "ADD TO CART"}
          </button>
          <button
            disabled={isCurrentOutOfStock}
            onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
            className="py-3 bg-black text-white text-[10px] font-sans uppercase tracking-[0.15em] font-bold hover:bg-[#0E0E0E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-black/5 rounded-2xl overflow-hidden"
          >
            BUY NOW
          </button>
        </div>'''

new_buttons = '''        {isCurrentOutOfStock ? (
          <div className="py-3 bg-black/5 text-black/40 text-[10px] font-sans uppercase tracking-[0.15em] font-bold text-center border border-black/5 rounded-2xl">
            OUT OF STOCK
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAction}
              className="py-3 border border-black/5 rounded-2xl overflow-hidden text-[10px] font-sans uppercase tracking-[0.15em] font-bold text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              {added ? <Check className="w-3 h-3" /> : null}
              {added ? "ADDED" : "ADD TO CART"}
            </button>
            <button
              onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
              className="py-3 bg-black text-white text-[10px] font-sans uppercase tracking-[0.15em] font-bold hover:bg-stone-900 transition-colors border border-black rounded-2xl overflow-hidden shadow-xl shadow-black/10"
            >
              BUY NOW
            </button>
          </div>
        )}'''

if '{isCurrentOutOfStock ? (' not in content:
    content = content.replace(buttons, new_buttons)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

