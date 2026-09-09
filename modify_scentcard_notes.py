import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Add onNoteClick to props interface
content = content.replace(
    'onBuyNow?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;',
    'onBuyNow?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;\n  onNoteClick?: (note: string) => void;'
)

# Add to destructuring
content = content.replace(
    'onBuyNow\n}) => {',
    'onBuyNow,\n  onNoteClick\n}) => {'
)
content = content.replace(
    'onBuyNow\n}: {',
    'onBuyNow,\n  onNoteClick\n}: {'
)

# Make the note span clickable
content = content.replace(
    'key={note}\n              className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 border border-[#E0E0E0] rounded-full font-mono font-medium tracking-wider transition-colors text-[#111111] bg-[#F4F4F2] hover:bg-[#E0E0E0] hover:border-[#E0E0E0] shadow-sm"',
    'key={note}\n              onClick={() => onNoteClick?.(note)}\n              className="cursor-pointer text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 border border-[#E0E0E0] rounded-full font-mono font-medium tracking-wider transition-colors text-[#111111] bg-[#F4F4F2] hover:bg-[#E0E0E0] hover:border-[#E0E0E0] shadow-sm"'
)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

