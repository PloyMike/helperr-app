const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the exact City section and add Languages after it
const oldSection = `              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>`;

const newSection = `              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Languages *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.languages} 
                  onChange={(e) => setFormData({...formData, languages: e.target.value})} 
                  style={styles.input}
                  placeholder="English, German, Thai"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>`;

content = content.replace(oldSection, newSection);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Languages box added!');
