import re

with open("src/App.tsx", "r") as f:
    text = f.read()

def count_tags(text, tag):
    open_tag = f"<{tag}"
    close_tag = f"</{tag}>"
    
    # We must exclude self-closing tags and tags in comments, but for a quick check we'll just count literal occurrences.
    # Actually, <div ... /> is possible.
    open_count = len(re.findall(r'<div[ >]', text))
    close_count = len(re.findall(r'</div>', text))
    print(f"div: {open_count} open, {close_count} close")
    
    open_count = len(re.findall(r'<section[ >]', text))
    close_count = len(re.findall(r'</section>', text))
    print(f"section: {open_count} open, {close_count} close")

    open_count = len(re.findall(r'<motion.div[ >]', text))
    close_count = len(re.findall(r'</motion.div>', text))
    print(f"motion.div: {open_count} open, {close_count} close")

count_tags(text, 'div')
