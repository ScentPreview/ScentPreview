import re

with open("src/App.tsx", "r") as f:
    content = f.read()

policies_data = '''
const POLICIES = {
  terms: {
    title: "TERMS OF USE",
    content: [
      { subtitle: "1. Overview", text: "By accessing or purchasing from Scent Preview, you agree to be bound by these Terms of Use. If you do not agree, please do not use our site or services." },
      { subtitle: "2. Product Use & Intellectual Property", text: "All content, branding, media, and formulations displayed on Scent Preview are the intellectual property of Scent Preview. Products are sold strictly for personal use and may not be resold or redistributed without explicit authorization." },
      { subtitle: "3. Pricing & Modifications", text: "Prices, product availability, and promotional offers are subject to change at any time without prior notice. We reserve the right to modify or discontinue any product or service at our discretion." },
      { subtitle: "4. Limitation of Liability", text: "Scent Preview is not liable for any direct, indirect, or incidental damages resulting from the use or inability to use our products or website." }
    ]
  },
  privacy: {
    title: "PRIVACY POLICY",
    content: [
      { subtitle: "1. Information Collection", text: "We collect personal information necessary to fulfill your orders, including your name, shipping address, email address, phone number, and payment details." },
      { subtitle: "2. How Information Is Used", text: "Your data is used strictly for order processing, shipping updates, customer support, and essential store communications. We do not sell, rent, or trade your personal data to third parties." },
      { subtitle: "3. Payment Security", text: "Payment processing is handled via encrypted third-party payment gateways. Scent Preview does not store or process raw credit card or bank credentials on our servers." },
      { subtitle: "4. Data Rights", text: "You have the right to request access to, correction of, or deletion of your personal data at any time by contacting customer support." }
    ]
  },
  shipping: {
    title: "SHIPPING POLICY",
    content: [
      { subtitle: "1. Processing & Handling", text: "All orders are processed within 1 to 3 business days (excluding weekends and holidays). You will receive a tracking confirmation email once your order has dispatched." },
      { subtitle: "2. Delivery Timelines", text: "Standard Domestic: 3 to 7 business days.\\nExpress Shipping: 1 to 3 business days.\\n(Note: Regional location or carrier delays may slightly impact estimated delivery windows.)" },
      { subtitle: "3. Order Tracking", text: "Once shipped, your order confirmation will include a tracking code to monitor delivery status in real time." }
    ]
  },
  returns: {
    title: "RETURN & REFUND POLICY",
    content: [
      { subtitle: "1. Return Eligibility", text: "Due to hygiene, safety, and personal care standards, opened or used fragrance bottles cannot be accepted for return. Unopened, factory-sealed products in their original packaging are eligible for return within 14 days of delivery." },
      { subtitle: "2. Damaged or Defective Items", text: "If your package arrives damaged, leaking, or broken, contact us within 48 hours of delivery with photos of the damaged item and packaging. We will issue an immediate replacement or full refund." },
      { subtitle: "3. Refund Process", text: "Once an eligible return is received and inspected, refunds will be issued to your original payment method within 5 to 7 business days. Original shipping fees are non-refundable." }
    ]
  }
};

export default function App() {'''

content = content.replace("export default function App() {", policies_data)

state_data = '''  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState<boolean>(() => {'''
new_state_data = '''  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | "shipping" | "returns" | null>(null);
  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState<boolean>(() => {'''
content = content.replace(state_data, new_state_data)

footer_original = '''          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => {
                setAdminPasscodeInput("");
                setAdminPasscodeError(null);
                setIsAdminOpen(true);
              }}
              className="text-[10px] font-mono text-stone-500 hover:text-[#00A8E8] uppercase tracking-widest transition-colors flex items-center gap-1.5 border border-black/5 hover:border-amber-gold/30 px-3 py-1.5  cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              Admin Vault
            </button>
          </div>'''

footer_new = '''          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-[10px] font-sans tracking-[0.15em] text-stone-500 uppercase">
              <button onClick={() => setPolicyModal("terms")} className="hover:text-amber-700 transition-colors cursor-pointer">Terms of Use</button>
              <button onClick={() => setPolicyModal("privacy")} className="hover:text-amber-700 transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => setPolicyModal("shipping")} className="hover:text-amber-700 transition-colors cursor-pointer">Shipping Policy</button>
              <button onClick={() => setPolicyModal("returns")} className="hover:text-amber-700 transition-colors cursor-pointer">Returns & Refunds</button>
            </div>
            <button
              onClick={() => {
                setAdminPasscodeInput("");
                setAdminPasscodeError(null);
                setIsAdminOpen(true);
              }}
              className="text-[10px] font-sans text-stone-500 hover:text-amber-700 uppercase tracking-widest transition-colors flex items-center gap-1.5 border border-black/5 rounded-full px-4 py-1.5 cursor-pointer shadow-sm"
            >
              <Lock className="w-3 h-3" />
              Admin Vault
            </button>
          </div>'''

content = content.replace(footer_original, footer_new)

# Add the Policy modal rendering at the end of the return statement before the closing div and AnimatePresence
# I'll search for the end of the App component return statement.
modal_code = '''
      {/* Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPolicyModal(null)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#F7F7F5] border border-black/5 text-stone-900 rounded-3xl shadow-2xl max-w-2xl w-full z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <h2 className="text-xl font-serif italic text-stone-900">
                  {POLICIES[policyModal].title}
                </h2>
                <button
                  onClick={() => setPolicyModal(null)}
                  className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer p-2 bg-stone-200/50 hover:bg-stone-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
                {POLICIES[policyModal].content.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-stone-900 mb-3">
                      {section.subtitle}
                    </h3>
                    <p className="text-sm font-sans text-stone-600 leading-relaxed whitespace-pre-line">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
'''

# Find the last closing div of the return
# The structure is roughly:
#       {/* Fullscreen Search Overlay */}
#       ...
#     </div>
#   );
# }

app_end = '''      </AnimatePresence>
    </div>
  );
}'''

new_app_end = modal_code + app_end

content = content.replace(app_end, new_app_end)

with open("src/App.tsx", "w") as f:
    f.write(content)

