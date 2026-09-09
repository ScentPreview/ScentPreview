import re

with open("src/App.tsx", "r") as f:
    content = f.read()

update_fn = '''
  const updateClaimStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setAdminComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };
'''

content = content.replace("  const fetchAdminComplaints = async () => {", update_fn + "\n  const fetchAdminComplaints = async () => {")

with open("src/App.tsx", "w") as f:
    f.write(content)

