import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# 1. Update initial selected size
old_state = '''  const [selectedSize, setSelectedSize] = useState<SizeType>(
    fragrance.disabledSizes?.includes("10ml")
      ? (fragrance.disabledSizes?.includes("5ml Normal") ? "5ml HQ" : "5ml Normal")
      : "10ml"
  );'''

new_state = '''  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stock = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "10ml"; // Fallback if all are out of stock
  });'''

content = content.replace(old_state, new_state)

# 2. Update ADD TO CART button to say [ SOLD OUT ]
old_button = '''          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="py-3 border border-black/5 rounded-2xl overflow-hidden text-[9px] font-sans uppercase tracking-widest font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {added ? <Check className="w-3 h-3" /> : null}
            {added ? "ADDED" : "ADD TO CART"}
          </button>'''

new_button = '''          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="py-3 border border-black/5 rounded-2xl overflow-hidden text-[9px] font-sans uppercase tracking-widest font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {added ? <Check className="w-3 h-3" /> : null}
            {added ? "ADDED" : isCurrentOutOfStock ? "[ SOLD OUT ]" : "ADD TO CART"}
          </button>'''

content = content.replace(old_button, new_button)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

