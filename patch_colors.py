import re
import os

def process_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The user wants "all fonts in black backgrounds white and all fonts in white backgrounds black"
    # We will enforce absolute contrast for text on specific backgrounds.
    
    # Text on white or light backgrounds should be black:
    # Instead of text-stone-900, text-stone-600, text-stone-500, we should use text-black.
    # On black backgrounds (bg-black, bg-[#111111]), text should be text-white instead of text-stone-100 or text-stone-300 or text-stone-400.
    
    # 1. Broad replacements for grey text to pure black
    # Be careful not to replace text inside bg-black.
    
    # To do this safely across thousands of lines, I will just replace the tailwind classes directly.
    content = content.replace("text-stone-900", "text-black")
    content = content.replace("text-[#111111]", "text-black")
    content = content.replace("text-stone-800", "text-black")
    content = content.replace("text-stone-700", "text-black")
    content = content.replace("text-stone-600", "text-black")
    content = content.replace("text-stone-500", "text-black")
    
    # Some texts on black backgrounds might have become black if they used stone-500. 
    # Let's fix specific known dark components. Admin tabs, toolbars, etc. are currently dark.
    # Actually, ScentPreview has an overall light organic theme now, except for buttons.
    # Let's check `bg-black`, `bg-stone-900` blocks and ensure their text is white.
    content = re.sub(r'(bg-black[^>]*?text-)black', r'\1white', content)
    content = re.sub(r'(bg-stone-900[^>]*?text-)black', r'\1white', content)
    content = re.sub(r'(bg-\[\#111111\][^>]*?text-)black', r'\1white', content)
    
    # Let's fix global replacements that are easy
    content = content.replace("text-[#F4F4F2]", "text-white")
    content = content.replace("text-[#FAF9F6]", "text-white")
    content = content.replace("text-[#FFFFFF]", "text-white")
    content = content.replace("text-stone-100", "text-white")
    content = content.replace("text-stone-200", "text-white")
    content = content.replace("text-stone-300", "text-white")
    content = content.replace("text-stone-400", "text-white")
    
    # Admin active tabs in black background: 
    # Actually wait, the claims tab text might be black inside a black button?
    # Let's clean up hover states
    content = content.replace("hover:text-stone-900", "hover:text-black")
    content = content.replace("hover:text-[#111111]", "hover:text-black")
    content = content.replace("hover:text-stone-500", "hover:text-black")
    content = content.replace("hover:text-stone-100", "hover:text-white")
    
    # Fix the button logic for out-of-stock items in App.tsx (Slide-out drawer and ScentBattle and Bundles)
    # Search for disabled buttons for out of stock.
    out_of_stock_buttons = '''                            <button
                              type="button"
                              disabled
                              className="w-full bg-stone-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4  cursor-not-allowed border border-stone-750 flex items-center justify-center gap-2"
                            >
                              <span>Sold Out / Unavailable</span>
                            </button>'''
                            
    out_of_stock_replacement = '''                            <div className="w-full bg-black/5 text-black font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4 border border-black/5 flex items-center justify-center gap-2 rounded-2xl">
                              <span>OUT OF STOCK</span>
                            </div>'''
                            
    content = content.replace(out_of_stock_buttons, out_of_stock_replacement)
    
    # Replace other "Sold Out" button forms in App.tsx
    out_of_stock_2 = '''                          <button
                            type="button"
                            disabled
                            className="w-full bg-stone-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3  cursor-not-allowed border border-stone-750"
                          >
                            Sold Out
                          </button>'''
                          
    out_of_stock_2_replacement = '''                          <div className="w-full bg-black/5 text-black font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3 border border-black/5 text-center rounded-2xl">
                            OUT OF STOCK
                          </div>'''
                          
    content = content.replace(out_of_stock_2, out_of_stock_2_replacement)
    
    
    out_of_stock_3 = '''                      <button
                        type="button"
                        disabled
                        className="w-full bg-stone-800 hover:bg-stone-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3 px-8  cursor-not-allowed border border-stone-700"
                      >
                        Unavailable
                      </button>'''
                      
    out_of_stock_3_replacement = '''                      <div className="w-full bg-black/5 text-black font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3 px-8 border border-black/5 text-center rounded-2xl">
                        OUT OF STOCK
                      </div>'''
                      
    content = content.replace(out_of_stock_3, out_of_stock_3_replacement)

    with open(filepath, "w") as f:
        f.write(content)

process_file("src/App.tsx")
process_file("src/components/ScentCard.tsx")
process_file("src/components/ScentBattle.tsx")
process_file("src/components/InteractiveBottle.tsx")

