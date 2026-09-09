import re

with open("src/components/ScentCard.tsx", "r") as f:
    content = f.read()

# Make sure useEffect is imported
if "useEffect" not in content:
    content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";')

old_state = '''  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stock = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "10ml"; // Fallback if all are out of stock
  });'''

new_state = '''  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stock = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "10ml"; // Fallback if all are out of stock
  });

  useEffect(() => {
    const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
    const isCurrentOutOfStock = fragrance.isOutOfStock || (currentStock !== undefined && currentStock === 0) || fragrance.disabledSizes?.includes(selectedSize);
    
    if (isCurrentOutOfStock) {
      const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
      for (const size of sizes) {
        const stock = fragranceStock ? fragranceStock[size] : undefined;
        const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
        if (!isSizeDisabled) {
          setSelectedSize(size);
          return;
        }
      }
    }
  }, [fragranceStock, fragrance.disabledSizes, fragrance.isOutOfStock, selectedSize]);'''

content = content.replace(old_state, new_state)

with open("src/components/ScentCard.tsx", "w") as f:
    f.write(content)

