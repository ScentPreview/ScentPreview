import re

with open("server.ts", "r") as f:
    content = f.read()

# Let's see if firestoreDb is imported properly
# Add Complaint type and complaints cache
interfaces = '''interface Order {
  orderNumber: string;
  items: any[];
  total: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  state?: string;
  pincode?: string;
  shippingProtection?: boolean;
  status: string;
  createdAt: Date;
  stockReduced?: boolean;
}'''

new_interfaces = '''interface Order {
  orderNumber: string;
  items: any[];
  total: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  state?: string;
  pincode?: string;
  shippingProtection?: boolean;
  status: string;
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
}
'''
if "interface Complaint" not in content:
    content = content.replace(interfaces, new_interfaces)


db_vars = '''let ordersDb: Order[] = [];
const DB_FILE_PATH = path.join(process.cwd(), "orders_backup.json");'''
new_db_vars = '''let ordersDb: Order[] = [];
let complaintsDb: Complaint[] = [];
const DB_FILE_PATH = path.join(process.cwd(), "orders_backup.json");'''
if "complaintsDb: Complaint[] = []" not in content:
    content = content.replace(db_vars, new_db_vars)


# Add APIs before the wildcard catch-all route:
api_routes = '''
  // API Route: Submit Complaint
  app.post("/api/complaints", async (req, res) => {
    try {
      const { buyerName, email, perfumeOrdered, imageProof } = req.body;
      const complaint: Complaint = {
        id: "CLM-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        buyerName,
        email,
        perfumeOrdered,
        imageProof, // Base64
        status: "pending",
        createdAt: new Date()
      };
      
      complaintsDb.push(complaint);
      
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, "complaints", complaint.id), complaint);
      }
      
      res.json({ success: true, complaint });
    } catch (error: any) {
      console.error("Error creating complaint:", error);
      res.status(500).json({ error: "Failed to submit claim." });
    }
  });

  // API Route: Get all complaints
  app.get("/api/complaints", authenticateAdmin, async (req, res) => {
    try {
      if (firestoreDb) {
        const snapshot = await getDocs(collection(firestoreDb, "complaints"));
        const complaints: Complaint[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Complaint;
          if (data.createdAt) {
            data.createdAt = (data.createdAt as any).toDate ? (data.createdAt as any).toDate() : new Date(data.createdAt);
          }
          complaints.push(data);
        });
        complaints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        complaintsDb = complaints;
      }
      res.json({ success: true, complaints: complaintsDb });
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ error: "Failed to fetch complaints." });
    }
  });
'''

# Find a good spot to insert it, like before app.delete("/api/orders/:orderNumber"
if "app.post(\"/api/complaints\"" not in content:
    content = content.replace('  // API Route: Delete an order by orderNumber', api_routes + '\n  // API Route: Delete an order by orderNumber')

with open("server.ts", "w") as f:
    f.write(content)

