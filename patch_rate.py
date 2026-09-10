import re
with open("server.ts", "r") as f:
    content = f.read()

# Remove the Strict Rate Limiting / Blocking State
content = re.sub(
    r"  // Strict Rate Limiting / Blocking State.*?  \}\);\n",
    "",
    content,
    flags=re.DOTALL
)

login_route = """  // API Route: Admin Login (Generates JWT)
  app.post("/api/login", (req, res) => {
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
  });"""

content = re.sub(
    r"  // API Route: Admin Login \(Generates JWT\).*?\}\);\n",
    login_route + "\n",
    content,
    flags=re.DOTALL
)

# Remove the loginLimiter entirely
content = re.sub(
    r"  // Rate Limiting for Admin Login to prevent brute force attacks.*?  \}\);\n\n",
    "",
    content,
    flags=re.DOTALL
)

with open("server.ts", "w") as f:
    f.write(content)
