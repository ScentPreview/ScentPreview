import re
with open("server.ts", "r") as f:
    content = f.read()

bad_miss = """      if (firestoreDb) {
         await setDoc(doc(firestoreDb, "admin_login_attempts", deviceId), {
            failedCount: 0,
            lastAttemptTimestamp: Date.now(),
            lockoutUntil: null
         }, { merge: true });
"""

good_miss = """      if (firestoreDb) {
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
  });
"""

content = content.replace(bad_miss, good_miss)

with open("server.ts", "w") as f:
    f.write(content)
