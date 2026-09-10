import re

with open("server.ts", "r") as f:
    content = f.read()

bad = """  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    message: { error: "Too many login attempts from this IP, please try again after 15 minutes", lockoutUntil: Date.now() + 15 * 60 * 1000 }
  });"""

good = """  const adminLoginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // Limit each IP to 3 login requests per `window`
    message: { error: "Too many login attempts from this IP, please try again after 10 minutes", lockoutUntil: Date.now() + 10 * 60 * 1000 }
  });"""

content = content.replace(bad, good)

with open("server.ts", "w") as f:
    f.write(content)
