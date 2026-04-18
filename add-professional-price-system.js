const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// 1. Update formData initial state - add new price fields
const oldFormData = /price: '',/;
const newFormData = `priceAmount: '',
    currency: 'EUR',
    priceType: 'hour',`;

content = content.replace(oldFormData, newFormData);

// 2. Update the data loading section
const oldPriceLoad = /price: data\.price \|\| '',/;
const newPriceLoad = `priceAmount: data.price_amount || data.price?.split(' ')[0] || '',
          currency: data.currency || 'EUR',
          priceType: data.price_type || 'hour',`;

content = content.replace(oldPriceLoad, newPriceLoad);

// 3. Update the save section
const oldPriceSave = /price: formData\.price,/;
const newPriceSave = `price_amount: formData.priceAmount,
          currency: formData.currency,
          price_type: formData.priceType,
          price: \`\${formData.priceAmount} \${formData.currency}/\${formData.priceType}\`,`;

content = content.replace(oldPriceSave, newPriceSave);

// 4. Replace the old price input with new professional system
const oldPriceInput = /<div>\s*<label style=\{styles\.label\}>Price \*<\/label>\s*<input type="text" required value=\{formData\.price\} onChange=\{\(e\) => setFormData\(\{\.\.\.formData, price: e\.target\.value\}\)\} style=\{styles\.input\} \/>\s*<\/div>/;

const newPriceInput = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 12 }}>
                <div>
                  <label style={styles.label}>Price Amount *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.priceAmount} 
                    onChange={(e) => setFormData({...formData, priceAmount: e.target.value})} 
                    style={styles.input}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label style={styles.label}>Currency *</label>
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
                </div>
                <div>
                  <label style={styles.label}>Per *</label>
                  <select 
                    value={formData.priceType} 
                    onChange={(e) => setFormData({...formData, priceType: e.target.value})} 
                    style={styles.input}
                    required
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                  </select>
                </div>
              </div>`;

content = content.replace(oldPriceInput, newPriceInput);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Professional price system added!');
console.log('   - Price amount field');
console.log('   - Currency dropdown (EUR, USD, GBP, CHF, THB)');
console.log('   - Price type (Per Hour / Per Day)');
