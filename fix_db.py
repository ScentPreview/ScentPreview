with open("server.ts", "r") as f:
    content = f.read()

content = content.replace("let ordersDb: Order[] = [];", "let ordersDb: Order[] = [];\nlet complaintsDb: Complaint[] = [];")

with open("server.ts", "w") as f:
    f.write(content)
