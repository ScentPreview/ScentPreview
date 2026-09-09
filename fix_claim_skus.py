import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Update the availableSkus logic
old_available_skus = '''        availableSkus={
          (() => {
            const skus: string[] = [];
            // Assuming stock is available in App scope
            CATALOG_DATA.forEach(f => {
              ["10ml", "5ml Normal", "5ml HQ"].forEach(size => {
                const isOutOfStock = f.isOutOfStock || f.disabledSizes?.includes(size as any) || (stock?.fragrances[f.id] && stock.fragrances[f.id][size] === 0);
                if (!isOutOfStock) skus.push(`${f.name} - ${size}`);
              });
            });
            BUNDLE_DATA.forEach(b => {
              const isOutOfStock = b.isOutOfStock || (stock?.bundles[b.id] === 0);
              if (!isOutOfStock) skus.push(`${b.name} (Bundle)`);
            });
            return skus;
          })()
        }'''

new_available_skus = '''        availableSkus={
          (() => {
            const skus: string[] = [];
            CATALOG_DATA.forEach(f => {
              ["10ml", "5ml Normal", "5ml HQ"].forEach(size => {
                skus.push(`${f.name} - ${size}`);
              });
            });
            BUNDLE_DATA.forEach(b => {
              skus.push(`${b.name} (Bundle)`);
            });
            return skus;
          })()
        }'''

content = content.replace(old_available_skus, new_available_skus)

# Update the select element
old_select = '''                <select
                  value={perfumeSize}
                  onChange={e => setPerfumeSize(e.target.value)}
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                >
                  <option value="" disabled>Select from available in-stock SKUs...</option>
                  {availableSkus.map(sku => (
                    <option key={sku} value={sku}>{sku}</option>
                  ))}
                </select>'''

new_select = '''                <input
                  type="text"
                  list="claim-skus"
                  value={perfumeSize}
                  onChange={e => setPerfumeSize(e.target.value)}
                  placeholder="Type or select a perfume & size..."
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                />
                <datalist id="claim-skus">
                  {availableSkus.map(sku => (
                    <option key={sku} value={sku} />
                  ))}
                </datalist>'''

content = content.replace(old_select, new_select)

with open("src/App.tsx", "w") as f:
    f.write(content)

