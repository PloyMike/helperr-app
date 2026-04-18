const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the City div and add Languages div right after it
const oldCityDiv = /(<div>\s*<label style=\{styles\.label\}>City \*<\/label>\s*<select required value=\{formData\.city\}[^<]*<\/select>\s*<\/div>)/;

const newCityAndLanguages = `$1
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
              </div>`;

content = content.replace(oldCityDiv, newCityAndLanguages);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Languages box added next to City!');
