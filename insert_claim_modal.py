import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Generate availableSkus logic inside App
# Or just put it inline where the component is rendered.
# We can compute availableSkus inline:
inline_render = '''
      {/* Shipping Claims Modal */}
      <ClaimFormModal 
        isOpen={isClaimFormOpen} 
        onClose={() => setIsClaimFormOpen(false)} 
        onSubmitSuccess={fetchAdminComplaints}
        availableSkus={
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
        }
      />
      
    </div>
  );
}'''

content = content.replace("    </div>\n  );\n}", inline_render)

with open("src/App.tsx", "w") as f:
    f.write(content)

