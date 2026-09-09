import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix the checkout section
content = content.replace(
    '₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}\n      </section>',
    '''₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-[#E0E0E0]/60">
                          <button
                            type="button"
                            onClick={() => {
                              if (!checkoutName || !checkoutEmail || !checkoutPhone || !checkoutPincode || !checkoutAddress) {
                                alert("Please fill all required fields before proceeding.");
                                return;
                              }
                              setShowPaymentPage(true);
                              setIsNameAuthorized(true);
                              setPaymentDetails({
                                name: checkoutName,
                                email: checkoutEmail,
                                phone: checkoutPhone,
                                address: checkoutAddress,
                                state: checkoutState,
                                pincode: checkoutPincode
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-full bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] py-4 rounded-sm text-xs font-mono tracking-widest uppercase transition-colors font-bold shadow-md cursor-pointer mb-3"
                          >
                            Proceed to Payment
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setIsCheckoutFormVisible(false)}
                            className="w-full bg-transparent hover:bg-white/[0.03] border border-[#E0E0E0]/60 text-[#111111] py-3.5 rounded-sm text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer"
                          >
                            Return
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
                <div className="w-full max-w-xl mx-auto text-center py-20 px-8 bg-white/[0.03]/40 border border-[#E0E0E0]/50 rounded-2xl">
                  <span className="block font-serif italic text-3xl text-[#111111] mb-4">
                    Order Received.
                  </span>
                  <p className="text-[#666666] text-sm font-sans mb-8">
                    Your luxury decant order has been successfully processed and is now queued for cleanroom preparation.
                  </p>
                  <button
                    onClick={() => {
                      setIsOrderPlaced(false);
                      setOrderConfirmationId("");
                    }}
                    className="bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] py-3 px-8 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Return to Studio
                  </button>
                </div>
            )}
          </AnimatePresence>
        </div>
      </section>'''
)

# And fix the bundle `}}.00` section completely.
# Find `        )}.00` and delete up to `</section>` which closes the `kinetic-catalog` section.
start = content.find('        )}.00')
if start != -1:
    end = content.find('</section>', start)
    if end != -1:
        content = content[:start] + '        )}\n      </section>' + content[end+10:]

with open("src/App.tsx", "w") as f:
    f.write(content)

