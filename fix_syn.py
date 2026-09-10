with open("server.ts", "r") as f:
    content = f.read()

bad = """      }

      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";

      // Generate token valid for 2 hours
      const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "2h" });
      res.json({ success: true, token });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });"""

content = content.replace(bad, "")

with open("server.ts", "w") as f:
    f.write(content)
