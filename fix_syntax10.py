import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# I will replace `              </AnimatePresence>\n            </motion.div>\n            ) : (`
# with `            </motion.div>\n            ) : (`

content = content.replace("              </AnimatePresence>\n            </motion.div>\n            ) : (", "            </motion.div>\n            ) : (")

with open("src/App.tsx", "w") as f:
    f.write(content)

