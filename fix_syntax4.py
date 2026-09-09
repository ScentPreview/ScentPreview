import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace `        )}}.00` down to `        )}\n      </section>`
# We will use regex
content = re.sub(
    r'\}\}\.00[\s\S]*?        \)\}\n      <\/section>',
    r'}\n      </section>',
    content
)

with open("src/App.tsx", "w") as f:
    f.write(content)

