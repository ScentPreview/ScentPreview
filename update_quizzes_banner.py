import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace Quiz Banner
content = re.sub(
    r'<div className="bg-[#FFFFFF]/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 mb-12 border border-[#E0E0E0] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>',
    r'''<div className="bg-[#F4F4F2] p-8 md:p-12 mb-12 border border-[#111111] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#111111] uppercase font-bold mb-3 block">
                [ SENSORY ANALYSIS ]
              </span>
              <h3 className="text-3xl md:text-5xl font-sans font-black text-[#111111] tracking-tighter mb-4">
                UNDECIDED?
              </h3>
              <p className="text-[#111111] text-xs font-sans max-w-md leading-relaxed">
                Take our sensory diagnostic quizzes to discover your perfect olfactory match based on aesthetic profiling and note preferences.
              </p>
            </div>
            
            <div className="relative z-10 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsAestheticQuizOpen(true)}
                className="w-full md:w-auto bg-[#111111] text-[#F4F4F2] transition-colors px-8 py-4 text-[10px] font-mono font-bold tracking-widest uppercase cursor-pointer hover:bg-[#0E0E0E]"
              >
                START DIAGNOSTIC
              </button>
            </div>
          </div>''',
    content
)

# And remove the wrapping container if I messed it up, wait, let me just check how it looks.
with open("src/App.tsx", "w") as f:
    f.write(content)

