import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace getDeviceId
content = re.sub(r'// Helper to get or generate unique device identifier.*?};\n', '', content, flags=re.DOTALL)


# Replace the state section to initialize from localStorage
old_state = r'  const \[adminPasscodeError, setAdminPasscodeError\] = useState<string \| null>\(null\);\n  const \[adminLockoutTime, setAdminLockoutTime\] = useState<number \| null>\(null\);\n  const \[lockoutTimeRemaining, setLockoutTimeRemaining\] = useState<string>\(""\);\n  const \[isAdminLocked, setIsAdminLocked\] = useState<boolean>\(false\);'

new_state = """  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [adminLockoutTime, setAdminLockoutTime] = useState<number | null>(() => {
    const stored = localStorage.getItem("scent_adminLockoutTime");
    return stored ? parseInt(stored) : null;
  });
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<string>("");
  const [isAdminLocked, setIsAdminLocked] = useState<boolean>(false);"""

content = re.sub(old_state, new_state, content)


# Replace the login handler
old_handler = r'                      onSubmit=\{async \(e\) => \{.*?                      \}\}'

new_handler = """                      onSubmit={async (e) => {
                        e.preventDefault();
                        const sanitizedInput = adminPasscodeInput.trim();
                        try {
                          const res = await safeFetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput })
                          });
                          
                          const data = await res.json();
                          
                          if (res.status === 429) {
                            const newLockout = data.lockoutUntil || (Date.now() + 10 * 60 * 1000);
                            setAdminLockoutTime(newLockout);
                            localStorage.setItem("scent_adminLockoutTime", newLockout.toString());
                            setAdminPasscodeError(data.error || "Vault locked out.");
                            return;
                          }
                          
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            localStorage.removeItem("scent_adminAttempts");
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminLockoutTime(null);
                          } else {
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {
                          const errorMsg = err.message || "Invalid passcode.";
                          setAdminPasscodeError(errorMsg);
                          
                          let attempts = parseInt(localStorage.getItem("scent_adminAttempts") || "0") + 1;
                          localStorage.setItem("scent_adminAttempts", attempts.toString());
                          
                          if (attempts >= 3) {
                             const newLockout = Date.now() + 10 * 60 * 1000;
                             setAdminLockoutTime(newLockout);
                             localStorage.setItem("scent_adminLockoutTime", newLockout.toString());
                             setAdminPasscodeError("Maximum authentication attempts exceeded.");
                          }
                        }
                      }}"""

content = re.sub(old_handler, new_handler, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)
