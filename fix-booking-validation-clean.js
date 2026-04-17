const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace the simple onChange with validation
const oldInput = `onChange={(e) => setCustomerName(e.target.value)}`;

const newInput = `onChange={(e) => {
                    const value = e.target.value;
                    const digitCount = (value.match(/\\d/g) || []).length;
                    
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.includes('+49') ||
                        value.includes('+43') ||
                        value.includes('+41') ||
                        digitCount >= 7) {
                      alert('⚠️ Please enter only your name. No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }
                    setCustomerName(value);
                  }}`;

content = content.replace(oldInput, newInput);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Validation added cleanly!');
