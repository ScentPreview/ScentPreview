import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add selectedNote state
state_block = """  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);"""
content = content.replace('  const [searchQuery, setSearchQuery] = useState("");', state_block)

# Pass onNoteClick to ScentCard
content = content.replace(
    'onBuyNow={handleBuyNow}',
    'onBuyNow={handleBuyNow}\n                onNoteClick={setSelectedNote}'
)

# Add NoteModal to the end of the return statement before the final </div>
modal_code = """
      {/* Note Image Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-square relative bg-[#F4F4F2] flex items-center justify-center">
                {/* Image Mapping logic */}
                {(() => {
                  const n = selectedNote.toLowerCase();
                  let imgUrl = `https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&q=80&w=800`; // generic texture fallback
                  if (n.includes('vanilla')) imgUrl = "/assets/images/vanilla_note_1788790600275.jpg";
                  else if (n.includes('bergamot')) imgUrl = "/assets/images/bergamot_note_1788790616416.jpg";
                  else if (n.includes('leather')) imgUrl = "/assets/images/leather_note_1788790644255.jpg";
                  else if (n.includes('lavender')) imgUrl = "/assets/images/lavender_note_1788790663755.jpg";
                  else if (n.includes('apple')) imgUrl = "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('pepper')) imgUrl = "https://images.unsplash.com/photo-1596660614838-8fa82b53b0a7?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('tonka') || n.includes('bean')) imgUrl = "https://images.unsplash.com/photo-1615485984428-c1fb6034107b?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('mandarin') || n.includes('tangerine')) imgUrl = "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('amber')) imgUrl = "https://images.unsplash.com/photo-1579624535804-d50d037042a9?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('cinnamon')) imgUrl = "https://images.unsplash.com/photo-1559114704-583eb531a742?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('date')) imgUrl = "https://images.unsplash.com/photo-1629881682845-f0270a2569de?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('ginger')) imgUrl = "https://images.unsplash.com/photo-1599940778173-e276d4acb2ab?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('cedar') || n.includes('wood')) imgUrl = "https://images.unsplash.com/photo-1557999880-e7403fc6dcf9?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('honey')) imgUrl = "https://images.unsplash.com/photo-1587049352847-4d4b12734185?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('coconut')) imgUrl = "https://images.unsplash.com/photo-1581452445100-349c2ba3be14?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('tobacco')) imgUrl = "https://images.unsplash.com/photo-1510260275826-663f7f185461?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('iris')) imgUrl = "https://images.unsplash.com/photo-1522066860010-ed7ce2791557?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('lemon')) imgUrl = "https://images.unsplash.com/photo-1590502593747-422e11894a44?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('tea')) imgUrl = "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('jasmine')) imgUrl = "https://images.unsplash.com/photo-1584820927498-cafea60e0a35?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('oud') || n.includes('incense')) imgUrl = "https://images.unsplash.com/photo-1608620897711-daaa8ce3e721?auto=format&fit=crop&q=80&w=800";
                  else if (n.includes('wasabi') || n.includes('green')) imgUrl = "https://images.unsplash.com/photo-1515589656461-9f935f11181f?auto=format&fit=crop&q=80&w=800";
                  
                  return (
                    <img 
                      src={imgUrl} 
                      alt={selectedNote} 
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
                
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="text-2xl font-serif text-white mb-2">{selectedNote}</h4>
                  <p className="text-white/80 text-sm font-sans">
                    A defining olfactory note providing unique character to the fragrance profile.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
"""

content = content.replace('    </div>\n  );\n}\n\nexport default App;', modal_code + '\n    </div>\n  );\n}\n\nexport default App;')

with open("src/App.tsx", "w") as f:
    f.write(content)
