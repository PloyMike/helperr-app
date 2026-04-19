const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the Additional Notes textarea and add validation
const oldNotesTextarea = /value=\{address\.notes\}\s*onChange=\{\(e\) => setAddress\(\{\.\.\.address, notes: e\.target\.value\}\)\}/;

const newNotesTextarea = `value={address.notes} 
                  onChange={(e) => {
                    const value = e.target.value;
                    const digitCount = (value.match(/\\d/g) || []).length;
                    
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.includes('+49') ||
                        value.includes('+43') ||
                        value.includes('+41') ||
                        digitCount >= 7) {
                      alert('⚠️ No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }
                    setAddress({...address, notes: value});
                  }}`;

content = content.replace(oldNotesTextarea, newNotesTextarea);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Validation added to Additional Notes field!');
