import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# cart.length
content = content.replace("({cart.length})", "{cart.length}")
content = content.replace("({cart.reduce((sum, item) => sum + item.quantity, 0)})", "{cart.reduce((sum, item) => sum + item.quantity, 0)}")

# Shipping Protection (₹150.00)
content = content.replace("Shipping Protection (₹150.00)", "Shipping Protection ₹150.00")

# Delivery Fee (₹116.00)
content = content.replace("Delivery Fee (₹116.00)", "Delivery Fee ₹116.00")
content = content.replace("Delivery Fee (₹116)", "Delivery Fee ₹116")

# ({item.size})
content = content.replace("({item.size})", "{item.size}")

# (Bundle)
content = content.replace("(Bundle)", "Bundle")
content = content.replace("(Bundle - ", "Bundle - ")

# (Yes/No)
content = content.replace("(Yes/No)", "Yes/No")

# ({sizeObj.label})
content = content.replace("({sizeObj.label})", "{sizeObj.label}")
content = content.replace("({size})", "{size}")
content = content.replace("({order.phone})", " {order.phone}")

with open("src/App.tsx", "w") as f:
    f.write(content)
