import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("Standard Shipping (₹116.00)", "Standard Shipping ₹116.00")
content = content.replace("(${sizeObj.label})", "{sizeObj.label}")
content = content.replace("(Confirmed)", "Confirmed")

with open("src/App.tsx", "w") as f:
    f.write(content)
