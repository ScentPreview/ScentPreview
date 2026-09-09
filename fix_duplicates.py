import re

with open("server.ts", "r") as f:
    content = f.read()

# Remove the first instance of the duplicate block
block_to_remove = '''  // Strict Rate Limiting / Blocking State
  const blockedIPs = new Map<string, number>();
  const failedAttempts = new Map<string, number>();

  // Global block middleware
  app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const blockUntil = blockedIPs.get(ip);
    
    if (blockUntil && Date.now() < blockUntil) {
      // Return 429 Too Many Requests if the user is completely blocked
      return res.status(429).send("ACCESS BLOCKED. Try again in 1 hour.");
    }
    next();
  });'''

content = content.replace(block_to_remove, "", 1)

with open("server.ts", "w") as f:
    f.write(content)
