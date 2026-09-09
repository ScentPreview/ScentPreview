import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace "MEN'S COLLECTION" with "MEN'S COLLECTION 0.2"
content = content.replace("MEN'S COLLECTION", "MEN'S COLLECTION 0.2")
content = content.replace("WOMEN'S COLLECTION", "WOMEN'S COLLECTION 0.2")

# We want to remove () // <> from the user list.
# Let's target specific instances we know about:
# "[ BUNDLE CAPSULES ]"
# "Top Tier // Men" -> "Top Tier Men"
# "Top Tier // Women" -> "Top Tier Women"
# "INTELLIGENT PROFILE ISOLATION // SYSTEM v2" -> "INTELLIGENT PROFILE ISOLATION SYSTEM v2"
# "Orders ({adminOrders.length})" -> this is admin, do not change.
content = content.replace("Top Tier // Men", "Top Tier Men")
content = content.replace("Top Tier // Women", "Top Tier Women")
content = content.replace("INTELLIGENT PROFILE ISOLATION // SYSTEM v2", "INTELLIGENT PROFILE ISOLATION SYSTEM v2")
content = content.replace("[ RE-DEFINING THE DECANT // 2026 EDITION ]", "RE-DEFINING THE DECANT 2026 EDITION")
content = content.replace("[ BUNDLE CAPSULES ]", "BUNDLE CAPSULES")

# Also need to make sure we don't use italic
content = content.replace("font-serif italic", "font-sans font-bold")
content = content.replace("italic", "")

with open("src/App.tsx", "w") as f:
    f.write(content)

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

content = content.replace("[ SOLD OUT ]", "SOLD OUT")
content = content.replace("[ {fragrance.id} ]", "{fragrance.id}")

content = content.replace("font-serif italic", "font-sans font-bold")
content = content.replace("italic", "")

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

