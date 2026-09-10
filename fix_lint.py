import re
with open("server.ts", "r") as f:
    content = f.read()

new_interfaces = """interface Order {
  orderNumber: string;
  items: { name: string; size: string; quantity: number }[];
  total: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  state?: string;
  pincode?: string;
  shippingProtection: boolean;
  status: "pending" | "paid" | "deleted";
  createdAt: Date;
  stockReduced?: boolean;
}

interface Complaint {
  id: string;
  buyerName: string;
  email: string;
  perfumeOrdered: string;
  imageProof: string;
  status: string;
  createdAt: Date;
}"""

content = re.sub(r'interface Order \{.*?\n\}', new_interfaces, content, flags=re.DOTALL)

with open("server.ts", "w") as f:
    f.write(content)
