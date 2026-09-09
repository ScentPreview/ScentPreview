import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the 3 divs with 2 divs
# Oh wait, my fix_syntax7.py had:
old_str = '''                              <div className="flex justify-between text-sm font-mono text-[#111111]  font-semibold pt-2">
                                <span>Total Due:</span>
                                <span className="text-[#00A8E8]">₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                              </div>
                            </div>
                          </div>
                        </div>'''

new_str = '''                              <div className="flex justify-between text-sm font-mono text-[#111111]  font-semibold pt-2">
                                <span>Total Due:</span>
                                <span className="text-[#00A8E8]">₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                              </div>
                            </div>
                          </div>'''

content = content.replace(old_str, new_str)

with open("src/App.tsx", "w") as f:
    f.write(content)

