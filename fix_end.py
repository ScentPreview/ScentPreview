import re
with open("server.ts", "r") as f:
    content = f.read()

# I need to find the missing bracket or whatever, let's just use `npm run build` locally after adding the missing `}` 
