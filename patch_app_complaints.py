import re

with open("src/App.tsx", "r") as f:
    content = f.read()

state_data = '''  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | "shipping" | "returns" | null>(null);'''
new_state_data = '''  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | "shipping" | "returns" | null>(null);
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);
  const [adminComplaints, setAdminComplaints] = useState<any[]>([]);
'''
if "isClaimFormOpen" not in content:
    content = content.replace(state_data, new_state_data)

tab_data = '''  const [adminActiveTab, setAdminActiveTab] = useState<"view" | "create" | "stock" | "prices">("view");'''
new_tab_data = '''  const [adminActiveTab, setAdminActiveTab] = useState<"view" | "create" | "stock" | "prices" | "claims">("view");'''
content = content.replace(tab_data, new_tab_data)

fetch_orders_str = '''        setAdminOrders(activeBackupOrders);
      }
    } finally {
      setIsLoadingAdminOrders(false);
    }
  };'''

fetch_complaints_str = '''
  const fetchAdminComplaints = async () => {
    if (!isAdminAuthenticated) return;
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await safeFetch("/api/complaints", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdminComplaints(data.complaints || []);
      }
    } catch (e) {
      console.error(e);
    }
  };
'''

if "fetchAdminComplaints" not in content:
    content = content.replace(fetch_orders_str, fetch_orders_str + fetch_complaints_str)

auth_effect_str = '''      if (isAdminAuthenticated) {
        fetchAdminOrders();
      }'''
new_auth_effect_str = '''      if (isAdminAuthenticated) {
        fetchAdminOrders();
        fetchAdminComplaints();
      }'''
content = content.replace(auth_effect_str, new_auth_effect_str)


# Admin Zone Tab
admin_tabs = '''                        <button
                          onClick={() => setAdminActiveTab("prices")}
                          className={`flex-1 py-3 px-4 text-xs font-mono uppercase tracking-widest transition-all text-center ${
                            adminActiveTab === "prices"
                              ? "bg-amber-500/10 text-amber-500 border-b-2 border-amber-500"
                              : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
                          }`}
                        >
                          Price Engine
                        </button>'''

new_admin_tabs = admin_tabs + '''
                        <button
                          onClick={() => setAdminActiveTab("claims")}
                          className={`flex-1 py-3 px-4 text-xs font-mono uppercase tracking-widest transition-all text-center ${
                            adminActiveTab === "claims"
                              ? "bg-red-500/10 text-red-500 border-b-2 border-red-500"
                              : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
                          }`}
                        >
                          Claims
                        </button>'''
if 'onClick={() => setAdminActiveTab("claims")}' not in content:
    content = content.replace(admin_tabs, new_admin_tabs)

with open("src/App.tsx", "w") as f:
    f.write(content)

