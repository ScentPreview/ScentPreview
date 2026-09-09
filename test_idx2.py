with open("src/App.tsx", "r") as f:
    content = f.read()
print(content.find('{/* Explore Quizzes & Find Your Scent */}'))
