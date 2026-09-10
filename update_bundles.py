import re
import math

with open("src/types.ts", "r") as f:
    content = f.read()

# Define bundle scaling factors based on main components
bundle_scales = {
    "spotlight-arabian": 0.6,
    "bundle-day-night": 0.6,
    "bundle-marine-core": 0.75,
    "bundle-rare-collector": 0.55,
    "bundle-office-rotation": 0.65,
    "bundle-cozy-winter": 0.5,
    "bundle-master-vault": 0.6,
    "bundle-zara-classics": 0.5
}

def replacer(match):
    bundle_id = match.group(1)
    prices_block = match.group(2)
    
    scale = bundle_scales.get(bundle_id, 0.6)
    
    # replace prices
    def price_repl(m):
        key = m.group(1)
        val = int(m.group(2))
        new_val = int(math.ceil(val * scale))
        return f'"{key}": {new_val}'
    
    new_prices_block = re.sub(r'"(10ml|5ml Normal|5ml HQ)": (\d+)', price_repl, prices_block)
    
    # also replace fixedPrice if exists
    new_prices_block = re.sub(r'fixedPrice: (\d+)', lambda m: f'fixedPrice: {int(math.ceil(int(m.group(1)) * scale))}', new_prices_block)
    
    return f'id: "{bundle_id}"{new_prices_block}'

content = re.sub(r'id: "(spotlight-[^"]+|bundle-[^"]+)"(.*?prices: \{[^\}]+\})', replacer, content, flags=re.DOTALL)

with open("src/types.ts", "w") as f:
    f.write(content)
