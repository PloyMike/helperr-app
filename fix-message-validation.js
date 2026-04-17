const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the message textarea and add validation
const oldMessageInput = /value=\{message\}\s*onChange=\{\(e\) => setMessage\(e\.target\.value\)\}/;

const newMessageInput = `value={message}
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
                    setMessage(value);
                  }}`;

content = content.replace(oldMessageInput, newMessageInput);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Message field validation added!');
