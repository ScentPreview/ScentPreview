with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("apple-liquid-btn", "")
content = content.replace("apple-glass-dark", "")
content = content.replace("apple-sheen", "")
content = content.replace("glass-panel-dark", "")

with open("src/App.tsx", "w") as f:
    f.write(content)

