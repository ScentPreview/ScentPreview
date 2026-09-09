with open("firestore.rules", "r") as f:
    content = f.read()

content = content.replace("match /orders/{orderId} {\n      allow read, write: if true;\n    }", "match /orders/{orderId} {\n      allow read, write: if true;\n    }\n    match /complaints/{complaintId} {\n      allow read, write: if true;\n    }")

with open("firestore.rules", "w") as f:
    f.write(content)
