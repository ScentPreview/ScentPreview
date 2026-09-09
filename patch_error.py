with open("server.ts", "r") as f:
    content = f.read()

content = content.replace('res.status(500).json({ error: "Failed to submit claim." });', 'res.status(500).json({ error: "Failed to submit claim.", details: error.message, stack: error.stack });')

with open("server.ts", "w") as f:
    f.write(content)
