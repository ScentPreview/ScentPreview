import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace grid wrapper
old_grid = '{/* Asymmetric Staggered Masonry Layout */}'
# Find where it ends
# It's better to just regex the grid section
content = re.sub(
    r'\{\/\* Asymmetric Staggered Masonry Layout \*\/\}[\s\S]*?\{filteredCatalog\.length > 0 && \([\s\S]*?<div className="grid[^"]+">([\s\S]*?)\{filteredCatalog\.map\(\(fragrance, index\) => \{[\s\S]*?return \([\s\S]*?<div[\s\S]*?key=\{fragrance\.id\}[\s\S]*?>([\s\S]*?)<ScentCard([\s\S]*?)\/>[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}\)\}[\s\S]*?<\/div>[\s\S]*?\)',
    r'''{/* Brutalist Grid Layout */}
        {filteredCatalog.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111111] border border-[#111111]">
            {filteredCatalog.map((fragrance, index) => {
              return (
                <div key={fragrance.id} className="bg-[#F4F4F2]">
                  <ScentCard\3/>
                </div>
              );
            })}
          </div>
        )}''',
    content
)

with open("src/App.tsx", "w") as f:
    f.write(content)

