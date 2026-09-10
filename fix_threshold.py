with open("server.ts", "r") as f:
    content = f.read()

bad = """        if (failedCount >= 5) {
           newLockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins
        }"""
good = """        if (failedCount >= 3) {
           newLockoutUntil = Date.now() + 10 * 60 * 1000; // 10 mins
        }"""

content = content.replace(bad, good)

with open("server.ts", "w") as f:
    f.write(content)
