import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_login_fetch = '''                        try {
                          const res = await safeFetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput })
                          });
                          const data = await res.json();
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminAttempts(0);
                          } else {
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {'''

new_login_fetch = '''                        try {
                          const res = await safeFetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput })
                          });
                          
                          if (res.status === 429) {
                            window.location.reload(); // Force reload to show blocked screen
                            return;
                          }
                          
                          const data = await res.json();
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminAttempts(0);
                          } else {
                            if (res.status === 401 && data.error && data.error.includes("attempts")) {
                               if (data.error.includes("0 attempts")) {
                                  setTimeout(() => window.location.reload(), 1000);
                               }
                               throw new Error(data.error);
                            }
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {'''

content = content.replace(old_login_fetch, new_login_fetch)

# And fix the catch block so it uses the error message from the backend if it exists
old_catch_block = '''                        } catch (err: any) {
                          const nextAttempts = adminAttempts + 1;
                          setAdminAttempts(nextAttempts);
                          if (err.message && err.message.includes("Too many")) {
                            setAdminPasscodeError(err.message);
                          } else {
                            setAdminPasscodeError(`Invalid passcode. ${3 - nextAttempts} attempt${3 - nextAttempts === 1 ? "" : "s"} remaining.`);
                          }
                        }'''

new_catch_block = '''                        } catch (err: any) {
                          const nextAttempts = adminAttempts + 1;
                          setAdminAttempts(nextAttempts);
                          setAdminPasscodeError(err.message || "Invalid passcode.");
                        }'''
content = content.replace(old_catch_block, new_catch_block)

with open("src/App.tsx", "w") as f:
    f.write(content)
