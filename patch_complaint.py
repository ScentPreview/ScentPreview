import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("if (!buyerName || !email || !perfumeSize || !imageProof) {", "if (!buyerName || !email || !perfumeSize) {")
content = content.replace('{imageProof ? "IMAGE ATTACHED. CLICK TO REPLACE." : "CLICK TO ATTACH PHOTO EVIDENCE"}', '{imageProof ? "IMAGE ATTACHED. CLICK TO REPLACE." : "CLICK TO ATTACH PHOTO EVIDENCE (OPTIONAL)"}')

with open("src/App.tsx", "w") as f:
    f.write(content)
