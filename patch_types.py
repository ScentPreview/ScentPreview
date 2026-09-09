import re

with open("src/types.ts", "r") as f:
    content = f.read()

# Add description and type to Fragrance interface
if "description?:" not in content:
    content = content.replace('  isPremium: boolean;', '  isPremium: boolean;\n  type?: string;\n  description?: string;')

with open("src/types.ts", "w") as f:
    f.write(content)

