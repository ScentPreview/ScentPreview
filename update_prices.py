import re

with open("src/types.ts", "r") as f:
    content = f.read()

# Define the price updates
updates = {
    "la-uno-qaswa": {"10ml": 269, "5ml Normal": 199, "5ml HQ": 233},
    "zara-seoul": {"10ml": 317, "5ml Normal": 223, "5ml HQ": 257},
    "zara-seoul-winter": {"10ml": 317, "5ml Normal": 223, "5ml HQ": 257},
    "zara-intense-dark": {"10ml": 357, "5ml Normal": 243, "5ml HQ": 277},
    "zara-rich-warm-addictive": {"10ml": 389, "5ml Normal": 259, "5ml HQ": 293},
    "zara-sunrise": {"10ml": 409, "5ml Normal": 269, "5ml HQ": 302},
    "zara-for-him-black": {"10ml": 409, "5ml Normal": 269, "5ml HQ": 302},
    "lattafa-khamrah": {"10ml": 449, "5ml Normal": 289, "5ml HQ": 323},
    "ck-one": {"10ml": 503, "5ml Normal": 316, "5ml HQ": 349},
    "ck2": {"10ml": 669, "5ml Normal": 399, "5ml HQ": 433},
    "givenchy-gentleman": {"10ml": 1269, "5ml Normal": 699, "5ml HQ": 733}
}

for frag_id, new_prices in updates.items():
    # Find the object for this frag_id
    pattern = r'(id:\s*"' + frag_id + r'".*?prices:\s*\{)[^\}]+(\})'
    
    def replacer(match):
        prefix = match.group(1)
        suffix = match.group(2)
        new_prices_str = f'\n      "10ml": {new_prices["10ml"]},\n      "5ml Normal": {new_prices["5ml Normal"]},\n      "5ml HQ": {new_prices["5ml HQ"]}\n    '
        return prefix + new_prices_str + suffix
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open("src/types.ts", "w") as f:
    f.write(content)
