import re

with open("src/types.ts", "r") as f:
    content = f.read()

# The standard prices
updates = {
    "la-uno-qaswa": {"10ml": 448, "5ml Normal": 332, "5ml HQ": 388},
    "zara-seoul": {"10ml": 528, "5ml Normal": 372, "5ml HQ": 428},
    "zara-seoul-winter": {"10ml": 528, "5ml Normal": 372, "5ml HQ": 428},
    "zara-intense-dark": {"10ml": 595, "5ml Normal": 405, "5ml HQ": 461},
    "zara-rich-warm-addictive": {"10ml": 648, "5ml Normal": 432, "5ml HQ": 488},
    "zara-sunrise": {"10ml": 682, "5ml Normal": 448, "5ml HQ": 504},
    "zara-for-him-black": {"10ml": 682, "5ml Normal": 448, "5ml HQ": 504},
    "lattafa-khamrah": {"10ml": 748, "5ml Normal": 482, "5ml HQ": 538},
    "ck-one": {"10ml": 838, "5ml Normal": 527, "5ml HQ": 582},
    "ck2": {"10ml": 1115, "5ml Normal": 665, "5ml HQ": 721},
    "givenchy-gentleman": {"10ml": 2115, "5ml Normal": 1165, "5ml HQ": 1221}
}

for frag_id, new_prices in updates.items():
    pattern = r'(id:\s*"' + frag_id + r'".*?prices:\s*\{)[^\}]+(\})'
    def replacer(match):
        prefix = match.group(1)
        suffix = match.group(2)
        new_prices_str = f'\n      "10ml": {new_prices["10ml"]},\n      "5ml Normal": {new_prices["5ml Normal"]},\n      "5ml HQ": {new_prices["5ml HQ"]}\n    '
        return prefix + new_prices_str + suffix
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

# Restore original bundles (which sum the standard prices)
bundles = {
    "spotlight-arabian": {"10ml": 1196, "5ml Normal": 814, "5ml HQ": 926},
    "bundle-day-night": {"10ml": 1364, "5ml Normal": 897, "5ml HQ": 1008},
    "bundle-marine-core": {"10ml": 1286, "5ml Normal": 858, "5ml HQ": 970},
    "bundle-rare-collector": {"10ml": 1710, "5ml Normal": 1070, "5ml HQ": 1182},
    "bundle-office-rotation": {"10ml": 2953, "5ml Normal": 1692, "5ml HQ": 1803},
    "bundle-cozy-winter": {"10ml": 1924, "5ml Normal": 1285, "5ml HQ": 1454},
    "bundle-master-vault": {"10ml": 1871, "5ml Normal": 1258, "5ml HQ": 1427},
    "bundle-zara-classics": {"10ml": 2433, "5ml Normal": 1673, "5ml HQ": 1897}
}

for bundle_id, new_prices in bundles.items():
    pattern = r'(id:\s*"' + bundle_id + r'".*?prices:\s*\{)[^\}]+(\})'
    def replacer(match):
        prefix = match.group(1)
        suffix = match.group(2)
        new_prices_str = f'\n      "10ml": {new_prices["10ml"]},\n      "5ml Normal": {new_prices["5ml Normal"]},\n      "5ml HQ": {new_prices["5ml HQ"]}\n    '
        return prefix + new_prices_str + suffix
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

# Restore fixedPrice for spotlight-arabian
content = re.sub(r'(id:\s*"spotlight-arabian".*?)fixedPrice:\s*\d+,', r'\1fixedPrice: 814,', content, flags=re.DOTALL)

with open("src/types.ts", "w") as f:
    f.write(content)
