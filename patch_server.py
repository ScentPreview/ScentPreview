import re

with open("server.ts", "r") as f:
    content = f.read()

# Replace Complaint Interface
old_interface = """interface Complaint {
  id: string;
  buyerName: string;
  email: string;
  perfumeOrdered: string;
  imageProof: string;
  status: string;
  createdAt: Date;
}"""

new_interface = """interface Complaint {
  id: string;
  buyerName: string;
  email: string;
  perfumeAndSize: string;
  proofImage: string;
  status: string;
  submittedAt: Date;
}"""

content = content.replace(old_interface, new_interface)

# Replace POST route
old_post = """  app.post("/api/complaints", async (req, res) => {
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
      };"""

new_post = """  app.post("/api/complaints", async (req, res) => {
    try {
      const { buyerName, email, perfumeAndSize, proofImage } = req.body;
      const claimId = "CLM-" + Math.floor(1000 + Math.random() * 9000);
      const complaint: Complaint = {
        id: claimId,
        buyerName,
        email,
        perfumeAndSize,
        proofImage, // Base64
        status: "pending",
        submittedAt: new Date()
      };"""

content = content.replace(old_post, new_post)

# Replace GET route date parsing
old_get_parse = """          if (data.createdAt) {
            data.createdAt = (data.createdAt as any).toDate ? (data.createdAt as any).toDate() : new Date(data.createdAt);
          }
          complaints.push(data);
        });
        complaints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());"""

new_get_parse = """          // Fallbacks for older data if they exist
          if ((data as any).createdAt && !data.submittedAt) data.submittedAt = (data as any).createdAt;
          if ((data as any).perfumeOrdered && !data.perfumeAndSize) data.perfumeAndSize = (data as any).perfumeOrdered;
          if ((data as any).imageProof && !data.proofImage) data.proofImage = (data as any).imageProof;

          if (data.submittedAt) {
            data.submittedAt = (data.submittedAt as any).toDate ? (data.submittedAt as any).toDate() : new Date(data.submittedAt);
          }
          complaints.push(data);
        });
        complaints.sort((a, b) => {
           const timeB = b.submittedAt ? b.submittedAt.getTime() : 0;
           const timeA = a.submittedAt ? a.submittedAt.getTime() : 0;
           return timeB - timeA;
        });"""

content = content.replace(old_get_parse, new_get_parse)

with open("server.ts", "w") as f:
    f.write(content)
