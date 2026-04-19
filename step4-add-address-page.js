const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find where step 4 starts (the confirm page) and add step 3 (address) before it
const beforeStep4 = /\{step === 4 && \(/;

const addressStep = `{step === 3 && (
            <div>
              <h3 style={styles.stepTitle}>Service Location</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Street *</label>
                <input 
                  type="text"
                  value={address.street} 
                  onChange={(e) => setAddress({...address, street: e.target.value})} 
                  style={styles.input}
                  placeholder="e.g. Main Street"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={styles.label}>City *</label>
                  <input 
                    type="text"
                    value={address.city} 
                    onChange={(e) => setAddress({...address, city: e.target.value})} 
                    style={styles.input}
                    placeholder="e.g. Berlin"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Postal Code *</label>
                  <input 
                    type="text"
                    value={address.postalCode} 
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})} 
                    style={styles.input}
                    placeholder="e.g. 10115"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>House Number *</label>
                <input 
                  type="text"
                  value={address.houseNumber} 
                  onChange={(e) => setAddress({...address, houseNumber: e.target.value})} 
                  style={styles.input}
                  placeholder="e.g. 42A"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Additional Notes (Optional)</label>
                <textarea 
                  value={address.notes} 
                  onChange={(e) => setAddress({...address, notes: e.target.value})} 
                  style={{...styles.input, minHeight: 80, resize: 'vertical'}}
                  placeholder="Floor, apartment number, entrance, etc."
                />
              </div>

              <div style={styles.footer}>
                <button onClick={() => setStep(2)} style={styles.btnSecondary}>
                  Back
                </button>
                <button 
                  onClick={() => {
                    if (!address.street || !address.city || !address.postalCode || !address.houseNumber) {
                      alert('Please fill in all required address fields');
                      return;
                    }
                    setStep(4);
                  }} 
                  style={styles.btnPrimary}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (`;

content = content.replace(beforeStep4, addressStep);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 4: Address page added between Time and Confirm!');
