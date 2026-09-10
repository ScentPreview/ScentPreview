import re
with open("server.ts", "r") as f:
    content = f.read()

new_login = """  // API Route: Admin Login (Generates JWT)
  app.post("/api/login", async (req, res) => {
    try {
      const { passcode, deviceId } = req.body;
      const expectedPasscode = "gephelbuiltallofthisforagirl";

      if (!deviceId) {
         return res.status(400).json({ error: "Missing device identifier." });
      }

      let attemptDoc: any = null;
      let failedCount = 0;
      let lockoutUntil: number | null = null;

      if (firestoreDb) {
        try {
          const docSnap = await getDoc(doc(firestoreDb, "admin_login_attempts", deviceId));
          if (docSnap.exists()) {
            attemptDoc = docSnap.data();
            failedCount = attemptDoc.failedCount || 0;
            lockoutUntil = attemptDoc.lockoutUntil || null;
          }
        } catch (e) {
          console.warn("Failed to check rate limit doc:", e);
        }
      }

      // Check if locked out
      if (lockoutUntil && Date.now() < lockoutUntil) {
         return res.status(429).json({ error: "Vault locked out.", lockoutUntil });
      }

      if (passcode !== expectedPasscode) {
        failedCount += 1;
        
        let newLockoutUntil = null;
        if (failedCount >= 5) {
           newLockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins
        }

        if (firestoreDb) {
           await setDoc(doc(firestoreDb, "admin_login_attempts", deviceId), {
              failedCount,
              lastAttemptTimestamp: Date.now(),
              lockoutUntil: newLockoutUntil
           }, { merge: true });
        }

        if (newLockoutUntil) {
           return res.status(429).json({ error: "Vault locked out.", lockoutUntil: newLockoutUntil });
        }

        return res.status(401).json({ error: "Invalid passcode." });
      }

      // Success - reset attempts
      if (firestoreDb) {
         await setDoc(doc(firestoreDb, "admin_login_attempts", deviceId), {
            failedCount: 0,
            lastAttemptTimestamp: Date.now(),
            lockoutUntil: null
         }, { merge: true });
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
    r'  // API Route: Admin Login \(Generates JWT\).*?\}\);\n',
    new_login + "\n",
    content,
    flags=re.DOTALL
)

with open("server.ts", "w") as f:
    f.write(content)
