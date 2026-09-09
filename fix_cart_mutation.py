import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. handleAddToCart
old1 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + quantityToAdd);
        nextCart[existingIndex].quantity = targetQty;
        return nextCart;
      }'''
new1 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + quantityToAdd);
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: targetQty };
        return nextCart;
      }'''
content = content.replace(old1, new1)

# 2. updateCartItemQuantity
old2 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        let newQty = currentQty + change;
        if (newQty > availableStock) {
          newQty = availableStock;
        }
        if (newQty <= 0) {
          return prev.filter((item) => !(item.id === id && item.size === size));
        }
        nextCart[existingIndex].quantity = newQty;
        return nextCart;
      }'''
new2 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        let newQty = currentQty + change;
        if (newQty > availableStock) {
          newQty = availableStock;
        }
        if (newQty <= 0) {
          return prev.filter((item) => !(item.id === id && item.size === size));
        }
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: newQty };
        return nextCart;
      }'''
content = content.replace(old2, new2)

# 3. handleAddBundleToCart and 4. handleBuyBundleNow have identical bodies for this part
old3 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + 1);
        nextCart[existingIndex].quantity = targetQty;
        return nextCart;
      }'''
new3 = '''      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + 1);
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: targetQty };
        return nextCart;
      }'''
content = content.replace(old3, new3)

with open("src/App.tsx", "w") as f:
    f.write(content)
