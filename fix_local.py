import re

with open("src/App.tsx", "r") as f:
    content = f.read()

bad_diff = """        if (diff <= 0) {
          setIsAdminLocked(false);
          setAdminLockoutTime(null);
          setLockoutTimeRemaining("");
        } else {"""

good_diff = """        if (diff <= 0) {
          setIsAdminLocked(false);
          setAdminLockoutTime(null);
          setLockoutTimeRemaining("");
          try {
            localStorage.removeItem("scent_adminLockoutTime");
            localStorage.setItem("scent_adminAttempts", "0");
          } catch(e){}
        } else {"""

content = content.replace(bad_diff, good_diff)

with open("src/App.tsx", "w") as f:
    f.write(content)
