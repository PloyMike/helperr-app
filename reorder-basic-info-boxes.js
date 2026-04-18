const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the entire Basic Info grid and replace it with new order
const oldGrid = /<div style=\{styles\.grid\}>\s*<div>\s*<label style=\{styles\.label\}>Name \*<\/label>[\s\S]*?<\/div>\s*<div style=\{\{ gridColumn: '1 \/ -1' \}\}>\s*<label style=\{styles\.label\}>About You/;

const newGrid = `<div style={styles.grid}>
              <div>
                <label style={styles.label}>Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} />
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
              <div>
                {/* Empty for spacing */}
              </div>
              <div>
                <label style={styles.label}>Country *</label>
                <select required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, city: ''})} style={styles.input}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>About You`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Basic Info boxes reordered!');
console.log('   Row 1: Name | Phone');
console.log('   Row 2: Languages | (empty)');
console.log('   Row 3: Country | City');
