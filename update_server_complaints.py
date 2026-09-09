import re

with open("server.ts", "r") as f:
    content = f.read()

# Update POST /api/complaints
old_post = '''  app.post("/api/complaints", async (req, res) => {
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
  });'''

new_post = '''  app.post("/api/complaints", async (req, res) => {
    try {
      const { buyerName, email, perfumeSize, imageProof } = req.body;
      const claimId = "CLM-" + Math.floor(1000 + Math.random() * 9000);
      const complaint: Complaint = {
        id: claimId,
        buyerName,
        email,
        perfumeOrdered: perfumeSize,
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
  });'''

content = content.replace(old_post, new_post)

# Add PATCH /api/complaints/:id
patch_code = '''  // API Route: Update complaint status
  app.patch("/api/complaints/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const complaint = complaintsDb.find(c => c.id === id);
      if (complaint) {
        complaint.status = status;
      }
      
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, "complaints", id), { status }, { merge: true });
      }
      
      res.json({ success: true, id, status });
    } catch (error: any) {
      console.error("Error updating complaint:", error);
      res.status(500).json({ error: "Failed to update claim." });
    }
  });
'''

# insert before GET /api/complaints
content = content.replace('  // API Route: Get all complaints', patch_code + '\n  // API Route: Get all complaints')

with open("server.ts", "w") as f:
    f.write(content)

