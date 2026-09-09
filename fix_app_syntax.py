with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if line.strip() == "// Navigation / Scroll helper" and i > 500 and i < 520:
        new_lines.append("    </div>\n")
        new_lines.append("  );\n")
        new_lines.append("};\n\n")
        new_lines.append("export default function App() {\n")
    new_lines.append(line)

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)

