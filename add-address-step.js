const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// 1. Add address fields to state
const oldState = /const \[customerName, setCustomerName\] = useState\(''\);/;
const newState = `const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: ''
  });`;

content = content.replace(oldState, newState);

// 2. Update progress bar - 4 steps instead of 3
const oldProgress = /<div style=\{styles\.progress\}>[\s\S]*?<\/div>/;
const newProgress = `<div style={styles.progress}>
          <div style={{...styles.progressStep, ...(step >= 1 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>1</div>
            <span style={styles.progressLabel}>Date</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 2 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>2</div>
            <span style={styles.progressLabel}>Time</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 3 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>3</div>
            <span style={styles.progressLabel}>Address</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 4 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>4</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>`;

content = content.replace(oldProgress, newProgress);

// 3. Add address step after time selection
const oldConfirmStep = /\{step === 3 && \(/;
const newSteps = `{step === 3 && (
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

content = content.replace(oldConfirmStep, newSteps);

// 4. Update all "step === 3" back buttons to setStep(3) instead of setStep(2)
content = content.replace(/\{step === 4 &&[\s\S]*?onClick=\{\(\) => setStep\(2\)\}/g, 
  (match) => match.replace('setStep(2)', 'setStep(3)'));

// 5. Update booking submission to include address
const oldBookingInsert = /const \{ error \} = await supabase\.from\('bookings'\)\.insert\(\[\{[\s\S]*?customer_name: customerName,/;
const newBookingInsert = `const { error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_email: user.email,
        customer_name: customerName,
        service_address: \`\${address.street} \${address.houseNumber}, \${address.postalCode} \${address.city}\`,
        address_notes: address.notes,`;

content = content.replace(oldBookingInsert, newBookingInsert);

// 6. Add address to summary in step 4
const oldSummary = /\{step === 4 &&[\s\S]*?<div style=\{styles\.summaryRow\}>/;
content = content.replace(
  /<div style=\{styles\.summaryRow\}>\s*<span style=\{styles\.summaryLabel\}>Time<\/span>/,
  `<div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Address</span>
                  <span style={styles.summaryValue}>{address.street} {address.houseNumber}, {address.postalCode} {address.city}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Time</span>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Address step added! (No emojis)');
console.log('   Flow: Date → Time → Address → Confirm');
