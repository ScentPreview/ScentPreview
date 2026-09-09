import re

with open("src/App.tsx", "r") as f:
    content = f.read()

bad_str = '''              </AnimatePresence>
            </motion.div>
            ) : ('''

if bad_str in content:
    content = content.replace(bad_str, '            </motion.div>\n            ) : (')
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find bad_str!")

