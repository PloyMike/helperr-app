const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Replace the entire price section with better layout
const oldPriceSection = /<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 \}\}>[\s\S]*?<\/div>\s*<\/div>/;

const newPriceSection = `<div>
                <label style={styles.label}>Pricing *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: 16 }}>
                  <input 
                    type="number" 
                    required 
                    value={formData.priceAmount} 
                    onChange={(e) => setFormData({...formData, priceAmount: e.target.value})} 
                    style={styles.input}
                    placeholder="Amount (e.g. 50)"
                  />
                  <select 
                    value={formData.currency} 
                    onChange={(e) => setFormData({...formData, currency: e.target.value})} 
                    style={styles.input}
                    required
                  >
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                    <option value="CHF">CHF</option>
                    <option value="THB">THB ฿</option>
                  </select>
                  <select 
                    value={formData.priceType} 
                    onChange={(e) => setFormData({...formData, priceType: e.target.value})} 
                    style={styles.input}
                    required
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>`;

content = content.replace(oldPriceSection, newPriceSection);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Professional pricing layout!');
console.log('   - One label "Pricing*" for all');
console.log('   - Amount box bigger');
console.log('   - Better spacing');
