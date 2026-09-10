import re

with open("server.ts", "r") as f:
    content = f.read()

# Replace from `// API Route: Admin Login` to `  });` (the end of the login route)

old_route_regex = r'  // API Route: Admin Login \(Generates JWT\)\n  app\.post\("/api/login", async \(req, res\) => \{.*?\n  \}\);\n'

new_route = """  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    message: { error: "Too many login attempts from this IP, please try again after 15 minutes", lockoutUntil: Date.now() + 15 * 60 * 1000 }
  });

  // API Route: Admin Login (Generates JWT)
  app.post("/api/login", adminLoginLimiter, (req, res) => {
    try {
      const { passcode } = req.body;
      const expectedPasscode = "gephelbuiltallofthisforagirl";

      if (passcode !== expectedPasscode) {
        return res.status(401).json({ error: "Invalid passcode." });
      }

      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";

      // Generate token valid for 2 hours
      const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "2h" });
      res.json({ success: true, token });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });
"""

content = re.sub(old_route_regex, new_route, content, flags=re.DOTALL)

with open("server.ts", "w") as f:
    f.write(content)
