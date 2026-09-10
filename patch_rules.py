with open("firestore.rules", "r") as f:
    content = f.read()

content = content.replace("match /complaints/{complaintId} {\n      allow read, write: if true;\n    }", "match /complaints/{complaintId} {\n      allow read, write: if true;\n    }\n    match /admin_login_attempts/{deviceId} {\n      allow read, write: if true;\n    }")

with open("firestore.rules", "w") as f:
    f.write(content)
