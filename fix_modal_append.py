import re

with open("src/App.tsx", "r") as f:
    content = f.read()

modal_code = '''
      {/* Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPolicyModal(null)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#F7F7F5] border border-black/5 text-stone-900 rounded-3xl shadow-2xl max-w-2xl w-full z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <h2 className="text-xl font-serif italic text-stone-900">
                  {POLICIES[policyModal].title}
                </h2>
                <button
                  onClick={() => setPolicyModal(null)}
                  className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer p-2 bg-stone-200/50 hover:bg-stone-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
                {POLICIES[policyModal].content.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-stone-900 mb-3">
                      {section.subtitle}
                    </h3>
                    <p className="text-sm font-sans text-stone-600 leading-relaxed whitespace-pre-line">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
'''

# Find the last `    </div>\n  );\n}`
content = re.sub(r'    </div>\n  \);\n}\s*$', modal_code + r'    </div>\n  );\n}', content)

with open("src/App.tsx", "w") as f:
    f.write(content)

