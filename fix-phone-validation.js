const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the validation section and improve phone detection
const oldValidation = /\/\/ Block emails, phone numbers, URLs[^}]+\}/s;

const newValidation = `// Block emails, phone numbers, URLs
                    // Count digits in the input
                    const digitCount = (value.match(/\d/g) || []).length;
                    
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.includes('+49') ||
                        value.includes('+43') ||
                        value.includes('+41') ||
                        digitCount >= 7 // 7 or more digits = likely a phone number
                    ) {
                      alert('⚠️ Please enter only your name. No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }`;

content = content.replace(oldValidation, newValidation);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Phone validation improved - blocks 7+ digits!');
