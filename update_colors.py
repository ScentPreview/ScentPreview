import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Text colors
    content = content.replace('#FBF6F0', '#F4F4F6')
    content = content.replace('#B1B7AB', '#8A8D93')
    
    # App.tsx background and noise
    if "App.tsx" in filepath:
        content = content.replace('className="min-h-screen bg-[#0B0A0A] font-sans selection:bg-[#276152] selection:text-[#FBF6F0]"', 'className="min-h-screen bg-gradient-to-br from-[#0B0C10] to-[#121318] bg-noise font-sans selection:bg-indigo-500/30 selection:text-[#F4F4F6] relative overflow-hidden"')
        
        # Insert radial glows right after the wrapper starts (around line 190, wait let's find a good anchor)
        # Anchor: <div className="min-h-screen
        glows = """<div className="min-h-screen bg-[#0B0C10] bg-noise font-sans selection:bg-indigo-500/30 selection:text-[#F4F4F6] relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10">"""
        
        content = content.replace('<div className="min-h-screen bg-[#0B0A0A] font-sans selection:bg-[#276152] selection:text-[#F4F4F6]">', glows)
        # We need to close the relative z-10 at the end if we did this, but maybe simpler to just put them fixed. Let's just put them right after <div className="min-h-screen...
        content = re.sub(
            r'(<div className="min-h-screen[^"]*">)',
            r'\1\n      {/* Ambient Radial Glows */}\n      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none z-0"></div>\n      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-900/10 blur-[150px] pointer-events-none z-0"></div>\n      <div className="fixed top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none z-0"></div>\n',
            content
        )
        
        # Fix the bg color class
        content = content.replace('bg-[#0B0A0A]', 'bg-transparent')
        content = content.replace('bg-[#111111]', 'bg-white/[0.03]')

    if "ScentCard.tsx" in filepath:
        # Glassmorphic Card Container
        content = re.sub(
            r'className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl [^"]*"',
            r'className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] group overflow-hidden"',
            content
        )
        # We might also want to add a subtle inner glow or line art in ScentCard
        
        # Fix specific old colors in ScentCard
        content = content.replace('bg-[#111111]/95', '')
        content = content.replace('bg-[#111111]/90', 'bg-white/[0.05]')
        content = content.replace('bg-[#111111]/60', 'bg-white/[0.03]')
        content = content.replace('bg-[#111111]/40', 'bg-white/[0.02]')
        content = content.replace('bg-[#111111]/30', 'bg-white/[0.02]')
        
        # Change accents from dark green #276152 to something more neutral/glassy or subtle indigo/amber
        content = content.replace('bg-[#276152]', 'bg-indigo-500/20 text-indigo-100 border-indigo-500/30')
        content = content.replace('bg-[#276152]/50', 'bg-white/[0.04]')
        content = content.replace('border-[#0D3A35]', 'border-indigo-500/30')
        content = content.replace('hover:bg-[#276152]/80', 'hover:bg-white/[0.1]')
        content = content.replace('hover:border-[#276152]', 'hover:border-white/[0.2]')
        content = content.replace('border-[#276152]/30', 'border-white/[0.08]')
        content = content.replace('hover:border-[#276152]/60', 'hover:border-white/[0.2]')
        content = content.replace('hover:bg-[#0D3A35]/60', 'hover:bg-white/[0.1]')
        content = content.replace('hover:bg-[#0D3A35]/40', 'hover:bg-white/[0.1]')
        
        # Change the ScentCard background abstract texture (just add a cool absolute div behind the content)
        # Find where it renders the inner content and put a background texture
        # Actually I can just add it manually later via sed.

    with open(filepath, 'w') as f:
        f.write(content)

process_file("src/App.tsx")
process_file("src/components/ScentCard.tsx")

