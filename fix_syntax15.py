import re

with open("src/App.tsx", "r") as f:
    content = f.read()

bad_str = '''                                <span>Total Due:</span>
                                <span className="text-[#00A8E8]">₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}
      </section>'''

good_str = '''                                <span>Total Due:</span>
                                <span className="text-[#00A8E8]">₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-[#E0E0E0]/60">
                            <button
                              type="submit"
                              className="w-full bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] py-4 rounded-sm text-xs font-mono tracking-widest uppercase transition-colors font-bold shadow-md cursor-pointer mb-3"
                            >
                              Confirm Payment
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
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white/[0.03] border border-[#E0E0E0] rounded-sm max-w-xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-[10px] font-mono text-[#00A8E8] uppercase tracking-[0.2em] font-semibold block mb-2">
                  Order Authorized
                </span>
                <h3 className="text-3xl font-serif text-[#111111] mb-4 italic">
                  Pouring Sequence Commenced
                </h3>
                <p className="text-[#666666] text-sm font-sans mb-8 px-6">
                  Thank you for your acquisition. The sterile extraction process has begun.
                </p>
                <button onClick={() => { setIsOrderPlaced(false); setOrderConfirmationId(""); }} className="bg-[#111111] hover:bg-[#000000] text-[#FFFFFF] py-3 px-8 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer">
                  Return to Studio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>'''

if bad_str in content:
    content = content.replace(bad_str, good_str)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find bad_str!")

