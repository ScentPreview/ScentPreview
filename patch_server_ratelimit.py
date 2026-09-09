import re

with open("server.ts", "r") as f:
    content = f.read()

# 1. Remove loginLimiter from app.post("/api/login")
content = content.replace('app.post("/api/login", loginLimiter, (req, res) => {', 'app.post("/api/login", (req, res) => {')

# 2. Add global block middleware right after app.use(express.json());
old_middleware = '  app.use(express.json());'

new_middleware = '''  app.use(express.json());

  // Strict Rate Limiting / Blocking State
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
    
    if (blockUntil && Date.now() >= blockUntil) {
       blockedIPs.delete(ip);
       failedAttempts.delete(ip);
    }
    next();
  });'''

content = content.replace(old_middleware, new_middleware)

# 3. Update the login route to handle attempts
old_login_logic = '''      const { passcode } = req.body;
      const expectedPasscode = "gephelbuiltallofthisforagirl";

      if (passcode !== expectedPasscode) {
        return res.status(401).json({ error: "Invalid passcode." });
      }

      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";'''

new_login_logic = '''      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const { passcode } = req.body;
      const expectedPasscode = "gephelbuiltallofthisforagirl";

      if (passcode !== expectedPasscode) {
        const attempts = (failedAttempts.get(ip) || 0) + 1;
        failedAttempts.set(ip, attempts);
        
        if (attempts >= 3) {
          blockedIPs.set(ip, Date.now() + 60 * 60 * 1000); // 1 hour block
        }
        
        return res.status(401).json({ error: `Invalid passcode.` });
      }

      // Success - reset attempts
      failedAttempts.delete(ip);

      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";'''

content = content.replace(old_login_logic, new_login_logic)

with open("server.ts", "w") as f:
    f.write(content)

