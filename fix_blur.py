with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("backdrop-blur-xl", "")
content = content.replace("backdrop-blur-md", "")
content = content.replace("backdrop-blur-sm", "")
content = content.replace("backdrop-blur", "")
content = content.replace("bg-[#111111]/80", "bg-[#111111]")
content = content.replace("bg-black/50", "bg-black")
content = content.replace("bg-[#F4F4F2]/50", "bg-[#F4F4F2]")
content = content.replace("bg-white/50", "bg-white")
content = content.replace("bg-[#FFFFFF]/50/80", "bg-[#FFFFFF]")
content = content.replace("bg-[#FFFFFF]/50/60", "bg-[#FFFFFF]")
content = content.replace("bg-[#FFFFFF]/50", "bg-[#FFFFFF]")
content = content.replace("bg-[#FFFFFF]/30", "bg-[#FFFFFF]")
content = content.replace("bg-white/[0.03]/10", "bg-white")
content = content.replace("bg-white/[0.03]", "bg-white")
content = content.replace("hover:bg-white/[0.03]/20", "hover:bg-gray-100")
content = content.replace("hover:bg-white/[0.03]", "hover:bg-gray-100")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Removed blur effects and transparency")
