import re
with open("src/App.tsx", "r") as f:
    content = f.read()

get_device_id = """
// Helper to get or generate unique device identifier
const getDeviceId = () => {
  let id = localStorage.getItem("device_client_id");
  if (!id) {
    id = "device_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("device_client_id", id);
  }
  return id;
};
"""

# add getDeviceId after the imports
content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\n" + get_device_id)


# Add adminLockoutTime and lockoutTimeRemaining state back in App
state_str = """
  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [adminLockoutTime, setAdminLockoutTime] = useState<number | null>(null);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<string>("");
  const [isAdminLocked, setIsAdminLocked] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    const checkLockout = () => {
      if (adminLockoutTime) {
        const diff = adminLockoutTime - Date.now();
        if (diff <= 0) {
          setIsAdminLocked(false);
          setAdminLockoutTime(null);
          setLockoutTimeRemaining("");
        } else {
          setIsAdminLocked(true);
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setLockoutTimeRemaining(`${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
        }
      } else {
        setIsAdminLocked(false);
        setLockoutTimeRemaining("");
      }
    };
    checkLockout();
    if (adminLockoutTime) {
      interval = setInterval(checkLockout, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [adminLockoutTime]);
"""
content = re.sub(
    r'  const \[adminPasscodeError, setAdminPasscodeError\] = useState<string \| null>\(null\);\n',
    state_str,
    content
)

# update login handler
login_handler = """                      onSubmit={async (e) => {
                        e.preventDefault();
                        const sanitizedInput = adminPasscodeInput.trim();
                        try {
                          const deviceId = getDeviceId();
                          const res = await safeFetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput, deviceId })
                          });
                          
                          const data = await res.json();
                          
                          if (res.status === 429) {
                            if (data.lockoutUntil) {
                              setAdminLockoutTime(data.lockoutUntil);
                            }
                            setAdminPasscodeError(data.error || "Vault locked out.");
                            return;
                          }
                          
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminLockoutTime(null);
                          } else {
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {
                          setAdminPasscodeError(err.message || "Invalid passcode.");
                        }
                      }}"""

content = re.sub(
    r'                      onSubmit=\{async \(e\) => \{.*?                      \}\}' ,
    login_handler,
    content,
    flags=re.DOTALL
)

# Fix the render references
# Replace `false ?` with `isAdminLocked ?` 
content = content.replace('{false ? "border-rose-500 animate-pulse" : "border-stone-200"}', '{isAdminLocked ? "border-rose-500 animate-pulse" : "border-stone-200"}')
content = content.replace('{false ? (', '{isAdminLocked ? (')
content = content.replace('{false ? "Vault Session Locked" : "Enter Vault Passcode"}', '{isAdminLocked ? "Vault Session Locked" : "Enter Vault Passcode"}')
content = content.replace('{false \n                        ? "Security protocol active. Maximum authentication attempts exceeded. Access has been frozen."\n                        : "This zone is strictly restricted to ScentPreview administrators. Please verify your credentials to decrypt the allocation logs."}', '{isAdminLocked ? "Security protocol active. Maximum authentication attempts exceeded. Access has been frozen." : "This zone is strictly restricted to ScentPreview administrators. Please verify your credentials to decrypt the allocation logs."}')

# add lockout timer to UI
ui_lockout = """
                      <input
                        type="password"
                        placeholder="Enter Passcode"
                        value={adminPasscodeInput}
                        onChange={(e) => setAdminPasscodeInput(e.target.value)}
                        className={`w-full text-center px-4 py-4 bg-white border ${adminPasscodeError ? "border-rose-300" : "border-stone-200"} text-black font-mono tracking-widest focus:outline-none focus:border-stone-900 transition-colors`}
                        autoFocus
                        disabled={isAdminLocked}
                      />
                      
                      {isAdminLocked && lockoutTimeRemaining && (
                        <div className="flex flex-col items-center justify-center p-3 border border-rose-200 bg-rose-50 space-y-1">
                          <span className="text-xs font-bold text-rose-800 uppercase tracking-widest">Lockout Active</span>
                          <span className="text-xl font-mono text-rose-600">{lockoutTimeRemaining}</span>
                        </div>
                      )}

                      {!isAdminLocked && (
                        <button
                          type="submit"
                          className="w-full bg-black text-white px-8 py-4 font-sans font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
                        >
                          Unlock Vault
                        </button>
                      )}"""

content = re.sub(
    r'                      <input\n                        type="password"\n                        placeholder="Enter Passcode"\n                        value=\{adminPasscodeInput\}\n                        onChange=\{\(e\) => setAdminPasscodeInput\(e\.target\.value\)\}\n                        className=\{`w-full text-center px-4 py-4 bg-white border \$\{adminPasscodeError \? "border-rose-300" : "border-stone-200"\} text-black font-mono tracking-widest focus:outline-none focus:border-stone-900 transition-colors`\}\n                        autoFocus\n                      />\n\n                      <button\n                        type="submit"\n                        className="w-full bg-black text-white px-8 py-4 font-sans font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"\n                      >\n                        Unlock Vault\n                      </button>',
    ui_lockout,
    content
)

content = content.replace('{!isAdminLocked ? (', '{!false ? (') # just in case, but let's change back `!false ?` to `!isAdminLocked` if I missed it, wait no I want to keep the !false? No!
content = content.replace('{!false ? (', '{true ? (')

with open("src/App.tsx", "w") as f:
    f.write(content)
