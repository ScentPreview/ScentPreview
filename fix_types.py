import re
with open("src/types.ts", "r") as f:
    content = f.read()

content = "export type SizeType = \"10ml\" | \"5ml Normal\" | \"5ml HQ\";\n\n" + content

with open("src/types.ts", "w") as f:
    f.write(content)
